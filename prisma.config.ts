import { defineConfig } from 'prisma/config'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL environment variable must be provided in production (use the Supabase pooled connection URL)')
}

if (!databaseUrl) {
  console.warn(
    'DATABASE_URL is not set. Using a local placeholder connection string for development tooling.'
  )
}

export default defineConfig({
  datasource: {
    // Prisma 7 usa o datasource definido em prisma.config.ts.
    url: databaseUrl ?? 'postgresql://postgres:postgres@localhost:5432/postgres',
  },
})
