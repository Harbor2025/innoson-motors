// src/collections/BlogPosts.ts
import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { calculateReadTimeMinutes, lexicalToPlainText } from '@/lib/readTime'

/**
 * Blog posts, matching innosonvehicles.com/blog: title, writer, date,
 * cover image, body content, and an auto-computed read time.
 */
export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedDate', 'status', 'readTimeMinutes'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-compute read time from the rich text body so editors never
        // have to enter it manually; still overridable via readTimeMinutes.
        if (data?.content) {
          const plain = lexicalToPlainText(data.content)
          data.readTimeMinutes = calculateReadTimeMinutes(plain)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: { description: 'Short summary shown on the blog listing/cards.' },
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', required: true },
    { name: 'author', type: 'relationship', relationTo: 'authors' },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' }, position: 'sidebar' },
    },
    {
      name: 'readTimeMinutes',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Auto-calculated from content on save (~200 words/min). Editable if needed.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true }],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
