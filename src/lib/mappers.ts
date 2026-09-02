// src/lib/mappers.ts
import type {
  AboutPageDTO,
  AuthorDTO,
  BlogDetailDTO,
  BlogListItemDTO,
  CategoryDTO,
  ContactInfoDTO,
  MediaDTO,
  ModelDetailDTO,
  ModelListItemDTO,
} from '@/types/dto'

/* eslint-disable @typescript-eslint/no-explicit-any */
// The `any` inputs below are raw Payload documents (generated types are
// produced by `pnpm generate:types` once the DB is connected); mappers
// narrow them into the frontend-facing DTOs declared in src/types/dto.ts.

export function toMediaDTO(doc: any): MediaDTO | null {
  if (!doc || typeof doc !== 'object') return null
  return {
    id: String(doc.id),
    url: doc.cloudinaryURL || doc.url || '',
    alt: doc.alt || '',
  }
}

export function toCategoryDTO(doc: any): CategoryDTO {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description ?? null,
    image: toMediaDTO(doc.image),
  }
}

export function toModelListItemDTO(doc: any): ModelListItemDTO {
  return {
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    tagline: doc.tagline ?? null,
    summary: doc.summary ?? null,
    category: {
      id: String(doc.category?.id ?? doc.category),
      name: doc.category?.name ?? '',
      slug: doc.category?.slug ?? '',
    },
    heroImage: toMediaDTO(doc.heroImage),
    featured: Boolean(doc.featured),
    basePrice: doc.basePrice ?? null,
  }
}

export function toModelDetailDTO(doc: any): ModelDetailDTO {
  return {
    ...toModelListItemDTO(doc),
    description: doc.description ?? null,
    design: doc.design ?? null,
    technology: doc.technology ?? null,
    specs: (doc.specs ?? []).map((s: any) => ({
      label: s.label,
      value: s.value,
      group: s.group ?? 'general',
    })),
    images: (doc.images ?? []).map((row: any) => ({
      image: toMediaDTO(row.image) as MediaDTO,
      caption: row.caption ?? null,
    })),
    brochure: toMediaDTO(doc.brochure),
  }
}

export function toAuthorDTO(doc: any): AuthorDTO | null {
  if (!doc) return null
  return {
    id: String(doc.id),
    name: doc.name,
    avatar: toMediaDTO(doc.avatar),
    bio: doc.bio ?? null,
  }
}

export function toBlogListItemDTO(doc: any): BlogListItemDTO {
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? null,
    coverImage: toMediaDTO(doc.coverImage),
    author: toAuthorDTO(doc.author),
    publishedDate: doc.publishedDate,
    readTimeMinutes: doc.readTimeMinutes ?? 1,
    tags: (doc.tags ?? []).map((t: any) => t.tag),
  }
}

export function toBlogDetailDTO(doc: any): BlogDetailDTO {
  return {
    ...toBlogListItemDTO(doc),
    content: doc.content,
  }
}

export function toAboutPageDTO(doc: any): AboutPageDTO {
  return {
    heading: doc.heading,
    intro: doc.intro ?? null,
    qualityPolicyHeading: doc.qualityPolicyHeading,
    qualityPolicy: doc.qualityPolicy ?? null,
    signatoryTitle: doc.signatoryTitle ?? null,
    heroImage: toMediaDTO(doc.heroImage),
    stats: (doc.stats ?? []).map((s: any) => ({ label: s.label, value: s.value })),
    gallery: (doc.gallery ?? []).map((g: any) => toMediaDTO(g.image) as MediaDTO),
  }
}

export function toContactInfoDTO(doc: any): ContactInfoDTO {
  return {
    phones: (doc.phones ?? []).map((p: any) => ({ label: p.label ?? null, number: p.number })),
    emails: (doc.emails ?? []).map((e: any) => e.email),
    address: doc.address ?? null,
    mapLat: doc.mapLat ?? null,
    mapLng: doc.mapLng ?? null,
    socialLinks: (doc.socialLinks ?? []).map((s: any) => ({ platform: s.platform, url: s.url })),
  }
}
