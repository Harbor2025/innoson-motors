// src/collections/Authors.ts
import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'

/** Blog post writers, shown as "writer" on each blog post. */
export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: { useAsTitle: 'name' },
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'avatar', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'textarea' },
  ],
}
