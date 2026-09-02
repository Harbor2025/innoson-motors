// src/app/api/blog/[slug]/route.ts
import { fail, ok } from '@/lib/response'
import { getBlogPostBySlug } from '@/services/blog.service'

/**
 * GET /api/blog/:slug
 * Public single blog post detail, including full rich text content.
 * Response: ApiSuccess<BlogDetailDTO> | ApiError (404 if not found/unpublished)
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const post = await getBlogPostBySlug(slug)
    if (!post) return fail('Blog post not found.', 404)
    return ok(post)
  } catch (err) {
    console.error(`GET /api/blog/${slug} failed:`, err)
    return fail('Could not load blog post.', 500)
  }
}
