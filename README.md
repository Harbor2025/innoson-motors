# Innoson Motors — Backend (Payload CMS + Next.js + Supabase + Cloudinary)

Fullstack Next.js app. Payload admin is mounted at `/admin` on the **same**
Next.js app/deployment — no separate backend. This delivery is **backend
only**: collections, globals, typed services, and REST API routes. No pages
or UI components are included; Tailwind is preconfigured for when a frontend
is added later.

## Features mapped from innosonvehicles.com

- **Categories** (Cars, MPV, PickUp, SUVs, Buses) → `categories` collection
- **Models** (G80, G40, Ikenga, Caris, Granite, buses, etc.) → `models`
  collection: name, tagline, description, design copy, tech copy, spec
  rows, hero image, gallery, brochure PDF
- **Get a Quote** (per-model form: name, phone, email, address) →
  `quote-requests` collection + `POST /api/quotes`
- **Blog** (title, writer, date, read time, cover image, tags) →
  `authors` + `blog-posts` collections; read time auto-computed on save
- **About** (company story + quality policy) → `about-page` global
- **Contact** (phones, emails, address, socials + message form) →
  `contact-info` global + `contact-messages` collection + `POST /api/contact`
- **Newsletter** (email capture only, no email sent) →
  `newsletter-subscribers` collection + `POST /api/newsletter`

## Stack

- Next.js 15 (App Router) + Payload 3 mounted at `/admin`
- Database: Supabase Postgres via `@payloadcms/db-postgres`
- Media: Cloudinary via a custom `@payloadcms/plugin-cloud-storage` adapter
  (`src/lib/cloudinaryStorage.ts`) — uploads go straight to Cloudinary, no
  local disk storage on Vercel
- Validation: `zod`
- Rich text: Lexical (`@payloadcms/richtext-lexical`)

## Setup

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URI, PAYLOAD_SECRET, CLOUDINARY_*
pnpm dev
```

Then visit `http://localhost:3000/admin` to create the first admin user.

### Generate Payload types (after DB is connected once)

```bash
pnpm generate:types
```

### Seed base categories

```bash
pnpm tsx scripts/seed.ts
```

## Environment variables

See `.env.example`:

- `DATABASE_URI` — Supabase Postgres **connection pooling** URI (session
  mode, port 6543) so it works from Vercel's serverless functions
- `PAYLOAD_SECRET` — long random string
- `NEXT_PUBLIC_SERVER_URL` — deployed app URL, no trailing slash
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` /
  `CLOUDINARY_UPLOAD_FOLDER`

## Public REST API (for the future frontend)

All hand-written routes return `{ success: true, data }` or
`{ success: false, error: { message, fieldErrors? } }` (see
`src/types/dto.ts` / `src/lib/response.ts`).

| Method | Path                  | Description                                   |
|--------|-----------------------|------------------------------------------------|
| GET    | `/api/categories`     | List vehicle categories                        |
| GET    | `/api/models`         | List published models (`?category=&featured=&limit=&page=`) |
| GET    | `/api/models/:slug`   | Single model detail                            |
| POST   | `/api/quotes`         | Submit a "Get a Quote" request                 |
| GET    | `/api/blog`           | List published blog posts (`?tag=&limit=&page=`) |
| GET    | `/api/blog/:slug`     | Single blog post detail                        |
| GET    | `/api/about`          | About page content                             |
| GET    | `/api/contact-info`   | Contact page content (phones/emails/address)   |
| POST   | `/api/contact`        | Submit a contact message (no email sent)       |
| POST   | `/api/newsletter`     | Subscribe an email (no email sent)             |

Payload's full auto-generated REST/GraphQL API is also available under
`/api/<collection-slug>` and `/api/graphql` (admin-authenticated for
non-public collections), mounted via `src/app/(payload)/api/[...slug]/route.ts`.

## Deployment (Vercel)

1. Push to GitHub, import into Vercel.
2. Set all env vars from `.env.example` in the Vercel project settings.
3. Use Supabase's **pooled** connection string (port 6543) for `DATABASE_URI`.
4. Deploy — `/admin` and `/api/*` are both served from this one app.
