// src/collections/Media.ts
import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'

/**
 * Central media library. Files are uploaded to Cloudinary via the storage
 * adapter configured in payload.config.ts (see src/lib/cloudinaryStorage.ts).
 * Payload still stores the metadata (alt text, width/height, mimeType, the
 * Cloudinary secure_url, etc.) in Postgres so it can be queried/related to
 * other collections (Models.images, BlogPosts.coverImage, ...).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    // Storage is delegated to Cloudinary by the cloud-storage plugin,
    // so `staticDir` is only used as a local scratch dir during processing.
    staticDir: 'media',
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt text',
    },
    {
      name: 'caption',
      type: 'text',
    },
    // Populated by the Cloudinary storage adapter (src/lib/cloudinaryStorage.ts).
    // Not editable in the admin UI; used to build/serve the CDN URL and to
    // delete the asset from Cloudinary when the Media doc is removed.
    {
      name: 'cloudinaryURL',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: { hidden: true },
    },
  ],
}
