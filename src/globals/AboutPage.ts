// src/globals/AboutPage.ts
import type { GlobalConfig } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'

/** Singleton content for the /about page (company story, quality policy, stats). */
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'About Innoson Vehicles' },
    { name: 'intro', type: 'richText' },
    { name: 'qualityPolicyHeading', type: 'text', defaultValue: 'Quality Policy' },
    { name: 'qualityPolicy', type: 'richText' },
    { name: 'signatoryTitle', type: 'text', defaultValue: 'Chairman/Chief Executive Officer' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'stats',
      type: 'array',
      label: 'Highlight stats',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
}
