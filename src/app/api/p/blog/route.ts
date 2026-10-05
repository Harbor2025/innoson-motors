// src/app/api/p/blog/route.ts
import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { listBlogQuerySchema } from '@/lib/validation'
import { listBlogPosts } from '@/services/blog.service'

/**
 * GET /api/p/blog?tag=&limit=&page=
 * Public, paginated list of published blog posts (newest first), each with
 * title, excerpt, cover image, writer, date, and computed read time.
 * Response: ApiSuccess<PaginatedResult<BlogListItemDTO>>
 */
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries())
  const parsed = listBlogQuerySchema.safeParse(params)
  if (!parsed.success) {
    return fail('Invalid query parameters.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await listBlogPosts(parsed.data)
    return ok(result)
  } catch (err) {
    console.error('GET /api/p/blog failed:', err)
    return fail('Could not load blog posts.', 500)
  }
}
