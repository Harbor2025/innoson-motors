// src/app/api/models/route.ts
import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { listModelsQuerySchema } from '@/lib/validation'
import { listModels } from '@/services/models.service'

/**
 * GET /api/models?category=&featured=&limit=&page=
 * Public, paginated list of published models. `category` filters by
 * category slug (e.g. "suvs"); `featured=true` restricts to homepage picks.
 * Response: ApiSuccess<PaginatedResult<ModelListItemDTO>>
 */
export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries())
  const parsed = listModelsQuerySchema.safeParse(params)
  if (!parsed.success) {
    return fail('Invalid query parameters.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await listModels(parsed.data)
    return ok(result)
  } catch (err) {
    console.error('GET /api/models failed:', err)
    return fail('Could not load models.', 500)
  }
}
