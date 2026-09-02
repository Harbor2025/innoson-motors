// src/collections/Models.ts
import type { CollectionConfig } from 'payload'
import { anyone, isAdmin } from '@/access/isAdmin'

/**
 * A single car model / vehicle detail page (e.g. "INNOSON G80", "INNOSON Ikenga").
 * Fields map directly onto what innosonvehicles.com shows per model:
 * name, tagline, description, design copy, spec sheet, technology highlights,
 * gallery images and an optional brochure file.
 */
export const Models: CollectionConfig = {
  slug: 'models',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'status', 'updatedAt'],
  },
  access: {
    // Public can only ever read models with status "published".
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'published' } }
    },
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "INNOSON G80"' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar', description: 'URL-safe id, e.g. "g80"' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
    },
    {
      name: 'tagline',
      type: 'text',
      admin: { description: 'e.g. "What a luxury SUV should be."' },
    },
    {
      name: 'summary',
      type: 'text',
      admin: { description: 'Short one-liner, e.g. "4x4-2.4L / Automatic / 5 Seats"' },
    },
    {
      name: 'description',
      type: 'richText',
      admin: { description: 'Full marketing description / overview copy.' },
    },
    {
      name: 'design',
      type: 'richText',
      admin: { description: 'The "Design" tab copy on the model page.' },
    },
    {
      name: 'technology',
      type: 'richText',
      admin: { description: 'The "Technology" tab copy / feature highlights.' },
    },
    {
      name: 'specs',
      type: 'array',
      label: 'Specifications',
      labels: { singular: 'Spec', plural: 'Specs' },
      admin: { description: 'Key/value spec rows, e.g. "Engine Capacity" / "3.0 Turbocharged"' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        {
          name: 'group',
          type: 'select',
          defaultValue: 'general',
          options: [
            { label: 'Dimensions', value: 'dimensions' },
            { label: 'Engine & Performance', value: 'performance' },
            { label: 'General', value: 'general' },
          ],
        },
      ],
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Main hero/banner image for the model page.' },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Gallery images',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'brochure',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional downloadable PDF brochure.' },
    },
    {
      name: 'basePrice',
      type: 'number',
      admin: { description: 'Optional, in Naira. Leave blank to show "Contact us".' },
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
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on homepage highlights.' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
