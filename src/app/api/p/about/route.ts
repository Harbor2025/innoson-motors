// src/app/api/p/about/route.ts
import { fail, ok } from '@/lib/response'
import { getAboutPage } from '@/services/contact.service'

/**
 * GET /api/p/about
 * Public content for the About page (company intro, quality policy, stats).
 * Response: ApiSuccess<AboutPageDTO>
 */
export async function GET() {
  try {
    const about = await getAboutPage()
    return ok(about)
  } catch (err) {
    console.error('GET /api/p/about failed:', err)
    return fail('Could not load about page.', 500)
  }
}
