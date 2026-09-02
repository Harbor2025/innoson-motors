// src/access/isAdmin.ts
import type { Access } from 'payload'

/**
 * Grants access only to authenticated admin users (the CMS/back-office users).
 * Used to lock down collections/globals that must only be editable from /admin
 * or by an authenticated admin via the API.
 */
export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Read access that is open to everyone (public storefront data:
 * categories, models, published blog posts, about/contact content).
 */
export const anyone: Access = () => true
