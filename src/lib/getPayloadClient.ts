// src/lib/getPayloadClient.ts
import 'server-only'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

let cached: Promise<Payload> | null = null

/**
 * Returns a memoized Payload local-API client. Use this from server-side
 * code (route handlers, services) instead of hitting the REST API over
 * HTTP — it's faster and works without a network round trip.
 *
 * If init fails (e.g. Postgres unavailable at build time) the cache is
 * reset so later attempts (e.g. at request time) can still succeed.
 */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config }).catch((err) => {
      cached = null
      throw err
    })
  }
  return cached
}
