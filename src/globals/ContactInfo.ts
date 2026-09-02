// src/globals/ContactInfo.ts
import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'

/** Singleton content for the /contact page: phone lines, addresses, socials, map. */
export const ContactInfo: GlobalConfig = {
  slug: 'contact-info',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'phones',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'number', type: 'text', required: true },
      ],
    },
    {
      name: 'emails',
      type: 'array',
      fields: [{ name: 'email', type: 'email', required: true }],
    },
    { name: 'address', type: 'textarea' },
    { name: 'mapLat', type: 'number' },
    { name: 'mapLng', type: 'number' },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'],
          required: true,
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
