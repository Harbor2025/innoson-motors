// src/lib/response.ts
import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'
import type { ApiResponseBody } from '@/types/dto'

/** Wraps a successful payload in the shared { success, data } envelope. */
export function ok<T>(data: T, init?: number | ResponseInit) {
  const body: ApiResponseBody<T> = { success: true, data }
  return NextResponse.json(body, typeof init === 'number' ? { status: init } : init)
}

/** Wraps an error message in the shared { success, error } envelope. */
export function fail(
  message: string,
  status = 400,
  fieldErrors?: Record<string, string[]>,
): NextResponse {
  const body: ApiResponseBody<never> = { success: false, error: { message, fieldErrors } }
  return NextResponse.json(body, { status })
}

/** Converts a Zod validation error into the fieldErrors shape used by `fail`. */
export function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    out[key] = out[key] || []
    out[key].push(issue.message)
  }
  return out
}
