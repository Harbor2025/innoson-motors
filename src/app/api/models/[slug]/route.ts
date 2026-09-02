// src/app/api/models/[slug]/route.ts
import { fail, ok } from '@/lib/response'
import { getModelBySlug } from '@/services/models.service'

/**
 * GET /api/models/:slug
 * Public single-model detail (name, description, design, specs, technology,
 * images) for a car detail page.
 * Response: ApiSuccess<ModelDetailDTO> | ApiError (404 if not found/unpublished)
 */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const model = await getModelBySlug(slug)
    if (!model) return fail('Model not found.', 404)
    return ok(model)
  } catch (err) {
    console.error(`GET /api/models/${slug} failed:`, err)
    return fail('Could not load model.', 500)
  }
}
