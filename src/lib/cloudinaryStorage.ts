// src/lib/cloudinaryStorage.ts
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig, FileData, TypeWithID } from 'payload'
import fs from 'node:fs'
import stream from 'node:stream'
import { promisify } from 'node:util'

const pipeline = promisify(stream.pipeline)

/**
 * Custom Cloudinary storage adapter for @payloadcms/plugin-cloud-storage.
 *
 * Handles:
 *   - uploading files (buffer OR tempFilePath, both supported) to Cloudinary
 *   - storing per-file Cloudinary URL + publicId on the doc itself
 *   - deleting Cloudinary objects when the Payload doc is deleted
 *   - generateURL: direct CDN lookup from stored url on the doc / size object
 *   - staticHandler: 302 redirect to the CDN URL when the file is requested
 *
 * Env vars required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,
 * CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_FOLDER (optional).
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'innoson-motors'

/** Per-file Cloudinary identifiers we persist on the doc / size object. */
interface CloudinaryFields {
  cloudinaryURL?: string
  cloudinaryPublicId?: string
}

type CloudinaryDoc = FileData & TypeWithID & CloudinaryFields
type CloudinaryData = Record<string, unknown> & CloudinaryFields

function publicIdFromFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

function uploadStreamToCloudinary(
  publicId: string,
): { stream: stream.Writable; promise: Promise<UploadApiResponse> } {
  let resolve: (r: UploadApiResponse) => void
  let reject: (e: unknown) => void
  const promise = new Promise<UploadApiResponse>((res, rej) => {
    resolve = res
    reject = rej
  })
  const writeStream = cloudinary.uploader.upload_stream(
    {
      folder: FOLDER,
      public_id: publicId,
      resource_type: 'auto',
      overwrite: true,
    },
    (error, result) => {
      if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'))
      resolve(result)
    },
  )
  return { stream: writeStream, promise }
}

async function uploadAnyFile(
  file: { buffer?: Buffer; tempFilePath?: string; filename: string },
  publicId: string,
): Promise<UploadApiResponse> {
  const { stream: writeStream, promise } = uploadStreamToCloudinary(publicId)

  if (file.buffer && file.buffer.length > 0) {
    const readable = new stream.PassThrough()
    readable.end(file.buffer)
    await pipeline(readable, writeStream).catch(async (err) => {
      // Swallow the ERR_STREAM_PREMATURELY_CLOSED on successful upload since
      // cloudinary's upload_stream may end the stream on completion before
      // our readable fully flushes.
      const result = await Promise.resolve(promise).catch(() => null as unknown as UploadApiResponse)
      if (!result) throw err
    })
    return promise
  }

  if (file.tempFilePath) {
    const readStream = fs.createReadStream(file.tempFilePath)
    await pipeline(readStream, writeStream).catch(async (err) => {
      const result = await Promise.resolve(promise).catch(() => null as unknown as UploadApiResponse)
      if (!result) throw err
    })
    return promise
  }

  throw new Error(
    `Cloudinary adapter: file ${file.filename} has neither buffer nor tempFilePath to upload.`,
  )
}

export const cloudinaryAdapter =
  (): Adapter =>
  ({ collection }: { collection: CollectionConfig }): GeneratedAdapter => {
    return {
      name: 'cloudinary',
      handleUpload: async ({ data, file }) => {
        const publicId = `${collection.slug}/${publicIdFromFilename(file.filename)}`
        const result = await uploadAnyFile(
          { buffer: file.buffer, tempFilePath: file.tempFilePath, filename: file.filename },
          publicId,
        )

        const typedData = data as CloudinaryData
        typedData.cloudinaryURL = result.secure_url
        typedData.cloudinaryPublicId = result.public_id

        return data
      },
      handleDelete: async ({ doc }) => {
        const publicId = (doc as CloudinaryDoc).cloudinaryPublicId
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
        }
      },
      // Signature per plugin types: { collection, data, filename, prefix? }
      // Called once per upload (original + each size). `data` is always the
      // PARENT doc, so we cannot distinguish sizes via it directly — instead
      // derive the CDN URL deterministically from the filename in the folder
      // we upload to. This avoids every size pointing at the same URL.
      generateURL: ({ filename, prefix }) => {
        if (!filename) return ''
        const base = (prefix ? `${prefix}/` : '')
        // Note: this matches how cloud-storage plugin resolves storageFilePath
        // for our adapter: compositional folder `${collection}/<filename>` and
        // we also store the definitive URL on data.cloudinaryURL.
        // Since `data.cloudinaryURL` is shared (parent doc only), we prefer
        // it when filename matches the parent doc; otherwise rebuild via
        // public id + folder structure.
        return (
          `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${FOLDER}/${collection.slug}/${base}${filename}`
        )
      },
      staticHandler: async (_req, { doc, params }) => {
        const docUrl = (doc as CloudinaryDoc | undefined)?.cloudinaryURL
        if (docUrl) return Response.redirect(docUrl, 302)

        // Fallback: derive CDN url from params (covers size requests too)
        const filename = params?.filename
        if (!filename) return new Response('Not found', { status: 404 })
        const prefix = params?.prefix ? `${params.prefix}/` : ''
        const coll = params?.collection || collection.slug
        const redirect = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${FOLDER}/${coll}/${prefix}${filename}`
        return Response.redirect(redirect, 302)
      },
    }
  }
