// src/app/api/newsletter/route.ts
import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { subscribeNewsletterSchema } from '@/lib/validation'
import { AlreadySubscribedError, subscribeToNewsletter } from '@/services/newsletter.service'

/**
 * POST /api/newsletter
 * Body: { email, source? }
 * Stores a newsletter signup only — no email is ever sent from this route.
 * Response: ApiSuccess<{ id: string; email: string }>
 */
export async function POST(req: NextRequest) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return fail('Request body must be valid JSON.', 400)
  }

  const parsed = subscribeNewsletterSchema.safeParse(json)
  if (!parsed.success) {
    return fail('Validation failed.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await subscribeToNewsletter(parsed.data)
    return ok(result, 201)
  } catch (err) {
    if (err instanceof AlreadySubscribedError) {
      return fail(err.message, 409)
    }
    console.error('POST /api/newsletter failed:', err)
    return fail('Could not subscribe. Please try again.', 500)
  }
}
