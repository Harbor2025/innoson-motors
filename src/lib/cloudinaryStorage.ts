// src/lib/cloudinaryStorage.ts
import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'
import stream from 'stream'

/**
 * Custom Cloudinary storage adapter for @payloadcms/plugin-cloud-storage.
 * Handles: uploading files (originals + Payload-generated resized image
 * variants) to Cloudinary, deleting them, and generating a `staticHandler`
 * that redirects file reads to the Cloudinary CDN URL.
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
        data.cloudinaryURL = result.secure_url
        data.cloudinaryPublicId = result.public_id

        // Also upload each Payload-generated resized variant (thumbnail, card, hero).
        if (file.sizes) {
          for (const sizeName of Object.keys(file.sizes)) {
            const size = file.sizes[sizeName]
            if (!size?.data) continue
            const sizePublicId = `${collection.slug}/${publicIdFromFilename(size.filename ?? file.filename)}-${sizeName}`
            const sizeResult = await uploadBuffer(size.data, sizePublicId)
            data.sizes = data.sizes || {}
            data.sizes[sizeName] = {
              ...(data.sizes?.[sizeName] || {}),
              cloudinaryURL: sizeResult.secure_url,
            }
          }
        }

        return data
      },
      handleDelete: async ({ doc }) => {
        const publicId = doc?.cloudinaryPublicId as string | undefined
        if (publicId) {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' })
        }
      },
      generateURL: ({ doc }) => (doc?.cloudinaryURL as string) || '',
      staticHandler: async (req, { doc }) => {
        const url = doc?.cloudinaryURL as string | undefined
        if (!url) {
          return new Response('Not found', { status: 404 })
        }
        return Response.redirect(url, 302)
      },
    }
  }
