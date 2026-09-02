// src/collections/Newsletter.ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

/**
 * Newsletter signups. Per requirements, this ONLY stores emails to the
 * database — no email is ever sent from this collection or its API route.
 */
export const Newsletter: CollectionConfig = {
  slug: 'newsletter-subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'subscribed',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    {
      name: 'source',
      type: 'text',
      admin: { description: 'Optional: which page/section the signup came from.' },
    },
  ],
}
