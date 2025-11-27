import { defineConfig } from 'prisma/config'

const databaseUrl = process.env.DATABASE_URL
const placeholderConnectionString = 'postgresql://postgres:postgres@localhost:5432/postgres'
if (!databaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL environment variable must be provided in production')
}

if (!databaseUrl && process.env.NODE_ENV !== 'production') {
  console.warn(
    'DATABASE_URL is not set. Using a local placeholder connection string for development tooling.'
  )
}

export default defineConfig({
  datasource: {
    // Prisma 7 usa o datasource definido em prisma.config.ts.
    url: databaseUrl ?? placeholderConnectionString,
  },
})
