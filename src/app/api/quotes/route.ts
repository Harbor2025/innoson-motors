// src/app/api/quotes/route.ts
import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { createQuoteRequestSchema } from '@/lib/validation'
import { createQuoteRequest, ModelNotFoundError } from '@/services/quotes.service'

/**
 * POST /api/quotes
 * Body: { name, phone, email, address, modelId, message? }
 * Public "Get a Quote" form submission from a model detail page.
 * Response: ApiSuccess<{ id: string; createdAt: string }>
 */
export async function POST(req: NextRequest) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return fail('Request body must be valid JSON.', 400)
  }

  const parsed = createQuoteRequestSchema.safeParse(json)
  if (!parsed.success) {
    return fail('Validation failed.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await createQuoteRequest(parsed.data)
    return ok(result, 201)
  } catch (err) {
    if (err instanceof ModelNotFoundError) {
      return fail(err.message, 404)
    }
    console.error('POST /api/quotes failed:', err)
    return fail('Could not submit your quote request. Please try again.', 500)
  }
}
