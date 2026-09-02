// src/lib/validation.ts
import { z } from 'zod'

/** POST /api/quotes body */
export const createQuoteRequestSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, 'Phone number contains invalid characters'),
  email: z.string().trim().email('Enter a valid email address'),
  address: z.string().trim().min(5, 'Address is too short').max(500),
  modelId: z.string().trim().min(1, 'modelId is required'),
  message: z.string().trim().max(2000).optional(),
})
export type CreateQuoteRequestBody = z.infer<typeof createQuoteRequestSchema>

/** POST /api/contact body */
export const createContactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(5, 'Message is too short').max(3000),
})
export type CreateContactMessageBody = z.infer<typeof createContactMessageSchema>

/** POST /api/newsletter body */
export const subscribeNewsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  source: z.string().trim().max(120).optional(),
})
export type SubscribeNewsletterBody = z.infer<typeof subscribeNewsletterSchema>

/** GET /api/models query params */
export const listModelsQuerySchema = z.object({
  category: z.string().trim().optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  page: z.coerce.number().int().min(1).default(1),
})

/** GET /api/blog query params */
export const listBlogQuerySchema = z.object({
  tag: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  page: z.coerce.number().int().min(1).default(1),
})
