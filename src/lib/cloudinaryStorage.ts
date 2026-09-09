// src/lib/cloudinaryStorage.ts
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig, FileData, TypeWithID } from 'payload'
import stream from 'stream'

/**
 * Custom Cloudinary storage adapter for @payloadcms/plugin-cloud-storage.
 * Handles: uploading files to Cloudinary, deleting them, and generating a
 * staticHandler that redirects file reads to the Cloudinary CDN URL.
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

/** Fields we attach to media docs via the adapter. */
interface CloudinaryFields {
  cloudinaryURL?: string
  cloudinaryPublicId?: string
}

type CloudinaryDoc = FileData & TypeWithID & CloudinaryFields
type CloudinaryData = Record<string, unknown> & CloudinaryFields

function publicIdFromFilename(filename: string): string {
  // Strip extension; Cloudinary manages its own extension/format.
  return filename.replace(/\.[^/.]+$/, '')
}

function uploadBuffer(buffer: Buffer, publicId: string): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
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
    const readable = new stream.PassThrough()
    readable.end(buffer)
    readable.pipe(uploadStream)
  })
}

export const cloudinaryAdapter =
  (): Adapter =>
  ({ collection }: { collection: CollectionConfig }): GeneratedAdapter => {
    return {
      name: 'cloudinary',
      handleUpload: async ({ data, file }) => {
        const publicId = `${collection.slug}/${publicIdFromFilename(file.filename)}`
        const result = await uploadBuffer(file.buffer, publicId)

        // Persist the Cloudinary URL + id on the doc so the API response
        // (and any frontend) can read a stable, CDN-served URL directly.
        const typedData = data as CloudinaryData
        typedData.cloudinaryURL = result.secure_url
        typedData.cloudinaryPublicId = result.public_id

        // Note: Payload imageSizes are processed as separate files by the
        // plugin (handleUpload is called once per size). Do not expect
        // file.sizes on the typed File object.

        return data
      },
      handleDelete: async ({ doc }) => {
        const publicId = (doc as CloudinaryDoc).cloudinaryPublicId
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
        }
      },
      // generateURL signature is { collection, data, filename, prefix? }
      generateURL: ({ data }) => {
        // Prefer the stored CDN URL; fall back to empty string
        return (data as CloudinaryData).cloudinaryURL || ''
      },
      staticHandler: async (_req, { doc }) => {
        const url = (doc as CloudinaryDoc | undefined)?.cloudinaryURL
        if (!url) {
          return new Response('Not found', { status: 404 })
        }
        return Response.redirect(url, 302)
      },
    }
  }