// src/collections/QuoteRequests.ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

/**
 * "Get a Quote" submissions from a model's detail page.
 * Public visitors can create these (via the POST /api/quotes route, which
 * validates input before calling Payload's local API); only admins can
 * read/manage them in /admin.
 */
export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'model', 'phone', 'email', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'address', type: 'text', required: true },
    {
      name: 'model',
      type: 'relationship',
      relationTo: 'models',
      required: true,
    },
    { name: 'message', type: 'textarea' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
