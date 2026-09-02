// src/app/api/contact-info/route.ts
import { fail, ok } from '@/lib/response'
import { getContactInfo } from '@/services/contact.service'

/**
 * GET /api/contact-info
 * Public content for the Contact page (phone lines, emails, address, map,
 * social links). Distinct from POST /api/contact, which submits a message.
 * Response: ApiSuccess<ContactInfoDTO>
 */
export async function GET() {
  try {
    const info = await getContactInfo()
    return ok(info)
  } catch (err) {
    console.error('GET /api/contact-info failed:', err)
    return fail('Could not load contact info.', 500)
  }
}
