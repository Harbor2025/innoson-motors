// src/services/blog.service.ts
import { getPayloadClient } from '@/lib/getPayloadClient'
import { toBlogDetailDTO, toBlogListItemDTO } from '@/lib/mappers'
import type { BlogDetailDTO, BlogListItemDTO } from '@/types/dto'
import type { PaginatedResult } from '@/services/models.service'
import type { Where } from 'payload'   // add this import
export interface ListBlogParams {
  tag?: string
  limit?: number
  page?: number
}

/** Lists published blog posts, newest first, optionally filtered by tag. */
export async function listBlogPosts(
  params: ListBlogParams = {},
): Promise<PaginatedResult<BlogListItemDTO>> {
  const payload = await getPayloadClient()
  const { tag, limit = 20, page = 1 } = params



// inside listBlogPosts:
  const where: Where = { status: { equals: 'published' } }
  if (tag) {
    where['tags.tag'] = { equals: tag }
  }

  const result = await payload.find({
    collection: 'blog-posts',
    where,
    sort: '-publishedDate',
    limit,
    page,
    depth: 1,
  })

  return {
    docs: result.docs.map(toBlogListItemDTO),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? page,
    limit: result.limit,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

/** Fetches one published blog post's full detail by slug, or null if not found. */
export async function getBlogPostBySlug(slug: string): Promise<BlogDetailDTO | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'blog-posts',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] ? toBlogDetailDTO(result.docs[0]) : null
}
