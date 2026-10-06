// src/lib/cloudinaryStorage.ts
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig, FileData, TypeWithID } from 'payload'
import fs from 'node:fs'

/**
 * Custom Cloudinary storage adapter for @payloadcms/plugin-cloud-storage.
 *
 * - Uploads original + imageSizes to Cloudinary
 * - Only writes cloudinaryURL / cloudinaryPublicId on the PARENT doc for the original file
 * - generateURL builds CDN URLs for original and each size from filename
 * - staticHandler redirects to the CDN
 *
 * Env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * Optional: CLOUDINARY_UPLOAD_FOLDER (default: innoson-motors)
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'innoson-motors'

interface CloudinaryFields {
  cloudinaryURL?: string
  cloudinaryPublicId?: string
}

type CloudinaryDoc = FileData & TypeWithID & CloudinaryFields
type CloudinaryData = Record<string, unknown> & CloudinaryFields

/** Strip extension → used as Cloudinary public_id basename */
function publicIdFromFilename(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

/** Payload size filenames look like: name-400x300.jpg */
function isResizedVersion(filename: string): boolean {
  return /-\d+x\d+\.[^.]+$/i.test(filename)
}

function buildCdnUrl(collectionSlug: string, filename: string, prefix?: string): string {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloud || !filename) return ''
  const base = prefix ? `${prefix}/` : ''
  return `https://res.cloudinary.com/${cloud}/image/upload/${FOLDER}/${collectionSlug}/${base}${filename}`
}

async function uploadAnyFile(
  file: { buffer?: Buffer; tempFilePath?: string; filename: string },
  publicId: string,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        public_id: publicId,
        resource_type: 'auto',
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Cloudinary upload failed'))
          return
        }
        resolve(result)
      },
    )

    if (file.buffer && file.buffer.length > 0) {
      uploadStream.end(file.buffer)
      return
    }

    if (file.tempFilePath) {
      fs.createReadStream(file.tempFilePath)
        .on('error', reject)
        .pipe(uploadStream)
      return
    }

    reject(
      new Error(
        `Cloudinary adapter: file "${file.filename}" has neither buffer nor tempFilePath.`,
      ),
    )
  })
}

export const cloudinaryAdapter =
  (): Adapter =>
  ({ collection }: { collection: CollectionConfig }): GeneratedAdapter => {
    return {
      name: 'cloudinary',

      handleUpload: async ({ data, file }) => {
        const filename = file.filename
        const isSize = isResizedVersion(filename)

        // public_id relative to folder, e.g. "media/my-image" or "media/my-image-400x300"
        const publicId = `${collection.slug}/${publicIdFromFilename(filename)}`

        const result = await uploadAnyFile(
          {
            buffer: file.buffer,
            tempFilePath: file.tempFilePath,
            filename,
          },
          publicId,
        )

        // Only attach Cloudinary fields on the parent document for the ORIGINAL file.
        // Size uploads must not overwrite parent cloudinaryURL / cloudinaryPublicId.
        if (!isSize) {
          const typedData = data as CloudinaryData
          typedData.cloudinaryURL = result.secure_url
          typedData.cloudinaryPublicId = result.public_id
        }

        return data
      },

      handleDelete: async ({ doc }) => {
        const publicId = (doc as CloudinaryDoc).cloudinaryPublicId
        if (!publicId) return

        try {
          // Delete original
          await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })

          // Best-effort: delete known size variants if they exist
          // (filenames were uploaded as separate public_ids)
          const sizes = (doc as FileData).sizes
          if (sizes && typeof sizes === 'object') {
            for (const size of Object.values(sizes)) {
              const sizeFilename = (size as { filename?: string } | null)?.filename
              if (!sizeFilename) continue
              const sizePublicId = `${FOLDER}/${collection.slug}/${publicIdFromFilename(sizeFilename)}`
              // result.public_id from upload already includes folder; destroy needs that form
              // Prefer constructing from what we stored pattern:
              const altId = `${collection.slug}/${publicIdFromFilename(sizeFilename)}`
              await cloudinary.uploader
                .destroy(`${FOLDER}/${altId}`, { resource_type: 'auto' })
                .catch(() => undefined)
              await cloudinary.uploader
                .destroy(altId, { resource_type: 'auto' })
                .catch(() => undefined)
            }
          }
        } catch (err) {
          console.error('[cloudinary] handleDelete error:', err)
        }
      },

      generateURL: ({ filename, prefix }) => {
        return buildCdnUrl(collection.slug, filename, prefix)
      },

      staticHandler: async (_req, { doc, params }) => {
        const docUrl = (doc as CloudinaryDoc | undefined)?.cloudinaryURL
        const requestedFilename = params?.filename

        // If no specific filename requested, or we only have the original URL, use it
        if (docUrl && !requestedFilename) {
          return Response.redirect(docUrl, 302)
        }

        if (!requestedFilename) {
          return new Response('Not found', { status: 404 })
        }

        // Size (or original) requests: build CDN URL from filename
        const prefix = params?.prefix
        const coll = params?.collection || collection.slug
        const redirect = buildCdnUrl(coll, requestedFilename, prefix)
        if (!redirect) return new Response('Not found', { status: 404 })
        return Response.redirect(redirect, 302)
      },
    }
  }