// src/app/api/categories/route.ts
import { fail, ok } from '@/lib/response'
import { listCategories } from '@/services/models.service'

/**
 * GET /api/categories
 * Public list of vehicle categories (Cars, MPV, PickUp, SUVs, Buses) for
 * building the site nav / category filter.
 * Response: ApiSuccess<CategoryDTO[]>
 */
export async function GET() {
  try {
    const categories = await listCategories()
    return ok(categories)
  } catch (err) {
    console.error('GET /api/categories failed:', err)
    return fail('Could not load categories.', 500)
  }
}
