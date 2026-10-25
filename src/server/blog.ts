import 'server-only'
import { notFound } from 'next/navigation'
import { listBlogPosts, getBlogPostBySlug, listTags } from '@/services/blog.service'
import type { ListBlogParams } from '@/services/blog.service'
import type { BlogDetailDTO, TagDTO } from '@/types/dto'

export async function getPublishedPosts(params?: ListBlogParams) {
  return listBlogPosts(params)
}

/** Detail lookup without throwing, so pages can fall back to the design sample data. */
export async function getPostBySlug(slug: string): Promise<BlogDetailDTO | null> {
  return getBlogPostBySlug(slug)
}

export async function getPostBySlugOrNotFound(slug: string): Promise<BlogDetailDTO> {
  const doc = await getBlogPostBySlug(slug)
  if (!doc) {
    notFound()
  }
  return doc as BlogDetailDTO
}

export async function getTags(): Promise<TagDTO[]> {
  return listTags()
}
