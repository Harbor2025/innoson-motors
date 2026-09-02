// src/app/(payload)/api/[...slug]/route.ts
import config from '../../../../payload.config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

/**
 * Payload's built-in REST API for every collection/global, auto-mounted at
 * /api/<collection-slug> (list/create), /api/<collection-slug>/:id
 * (read/update/delete) and /api/globals/<global-slug>.
 *
 * This is the low-level CRUD surface used by the admin UI and available for
 * a future frontend to call directly for public read endpoints (e.g.
 * GET /api/models, GET /api/blog-posts). The hand-written, DTO-shaped routes
 * in src/app/api/* wrap the specific public-facing use cases (submitting a
 * quote, subscribing to the newsletter, etc.) with validation on top of this.
 */
export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
