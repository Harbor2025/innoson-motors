// src/payload.config.ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Categories } from '@/collections/Categories'
import { Models } from '@/collections/Models'
import { Authors } from '@/collections/Authors'
import { BlogPosts } from '@/collections/BlogPosts'
import { QuoteRequests } from '@/collections/QuoteRequests'
import { ContactMessages } from '@/collections/ContactMessages'
import { Newsletter } from '@/collections/Newsletter'
import { AboutPage } from '@/globals/AboutPage'
import { ContactInfo } from '@/globals/ContactInfo'
import { cloudinaryAdapter } from '@/lib/cloudinaryStorage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    // Admin UI is served at /admin per the Next.js route group in
    // src/app/(payload)/admin/[[...segments]]/page.tsx
  },
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  collections: [
    Users,
    Media,
    Categories,
    Models,
    Authors,
    BlogPosts,
    QuoteRequests,
    ContactMessages,
    Newsletter,
  ],
  globals: [AboutPage, ContactInfo],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    cloudStoragePlugin({
      collections: {
        media: {
          adapter: cloudinaryAdapter(),
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
})
