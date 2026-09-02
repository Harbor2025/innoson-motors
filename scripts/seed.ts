// scripts/seed.ts
import { getPayload } from 'payload'
import config from '../src/payload.config'

/**
 * Seeds baseline categories mirroring innosonvehicles.com's nav groups.
 * Run with: pnpm tsx scripts/seed.ts   (requires DATABASE_URI + PAYLOAD_SECRET in env)
 * Safe to re-run: skips categories that already exist by slug.
 */
const CATEGORIES = [
  { name: 'Cars', slug: 'cars', order: 1 },
  { name: 'MPV', slug: 'mpv', order: 2 },
  { name: 'PickUp', slug: 'pickup', order: 3 },
  { name: 'SUVs', slug: 'suvs', order: 4 },
  { name: 'Buses', slug: 'buses', order: 5 },
]

async function run() {
  const payload = await getPayload({ config })

  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`Skipping existing category: ${cat.name}`)
      continue
    }
    await payload.create({ collection: 'categories', data: cat })
    console.log(`Created category: ${cat.name}`)
  }

  console.log('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
