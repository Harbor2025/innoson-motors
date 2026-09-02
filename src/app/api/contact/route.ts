// src/app/api/contact/route.ts
import type { NextRequest } from 'next/server'
import { fail, ok, zodFieldErrors } from '@/lib/response'
import { createContactMessageSchema } from '@/lib/validation'
import { createContactMessage } from '@/services/contact.service'

/**
 * POST /api/contact
 * Body: { name, email, phone?, subject?, message }
 * Public "Contact us" form submission. No email is sent — DB storage only.
 * Response: ApiSuccess<{ id: string; createdAt: string }>
 */
export async function POST(req: NextRequest) {
  let json: unknown
  try {
    json = await req.json()
  } catch {
    return fail('Request body must be valid JSON.', 400)
  }

  const parsed = createContactMessageSchema.safeParse(json)
  if (!parsed.success) {
    return fail('Validation failed.', 422, zodFieldErrors(parsed.error))
  }

  try {
    const result = await createContactMessage(parsed.data)
    return ok(result, 201)
  } catch (err) {
    console.error('POST /api/contact failed:', err)
    return fail('Could not send your message. Please try again.', 500)
  }
}
