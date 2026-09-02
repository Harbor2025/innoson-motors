// src/types/dto.ts

/**
 * Frontend-facing Data Transfer Objects. These are the shapes a future
 * frontend should consume — deliberately flatter/simpler than Payload's
 * raw document shape (e.g. relationships pre-resolved, richText left as-is
 * for a renderer, media resolved to a plain { url, alt } object).
 */

export interface MediaDTO {
  id: string
  url: string
  alt: string
}

export interface CategoryDTO {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: MediaDTO | null
}

export interface SpecRowDTO {
  label: string
  value: string
  group: 'dimensions' | 'performance' | 'general'
}

export interface ModelListItemDTO {
  id: string
  name: string
  slug: string
  tagline?: string | null
  summary?: string | null
  category: Pick<CategoryDTO, 'id' | 'name' | 'slug'>
  heroImage?: MediaDTO | null
  featured: boolean
  basePrice?: number | null
}

export interface ModelDetailDTO extends ModelListItemDTO {
  description?: unknown // Lexical richText JSON, render on the frontend
  design?: unknown
  technology?: unknown
  specs: SpecRowDTO[]
  images: { image: MediaDTO; caption?: string | null }[]
  brochure?: MediaDTO | null
}

export interface AuthorDTO {
  id: string
  name: string
  avatar?: MediaDTO | null
  bio?: string | null
}

export interface BlogListItemDTO {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: MediaDTO | null
  author?: AuthorDTO | null
  publishedDate: string
  readTimeMinutes: number
  tags: string[]
}

export interface BlogDetailDTO extends BlogListItemDTO {
  content: unknown // Lexical richText JSON
}

export interface AboutPageDTO {
  heading: string
  intro?: unknown
  qualityPolicyHeading: string
  qualityPolicy?: unknown
  signatoryTitle?: string | null
  heroImage?: MediaDTO | null
  stats: { label: string; value: string }[]
  gallery: MediaDTO[]
}

export interface ContactInfoDTO {
  phones: { label?: string | null; number: string }[]
  emails: string[]
  address?: string | null
  mapLat?: number | null
  mapLng?: number | null
  socialLinks: { platform: string; url: string }[]
}

// ---- Write DTOs (request payloads for POST endpoints) ----

export interface CreateQuoteRequestInput {
  name: string
  phone: string
  email: string
  address: string
  modelId: string
  message?: string
}

export interface CreateContactMessageInput {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface SubscribeNewsletterInput {
  email: string
  source?: string
}

// ---- Generic API envelope used by every hand-written route in src/app/api ----

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: {
    message: string
    fieldErrors?: Record<string, string[]>
  }
}

export type ApiResponseBody<T> = ApiSuccess<T> | ApiError
