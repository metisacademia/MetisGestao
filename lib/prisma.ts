import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL
const placeholderConnectionString = 'postgresql://postgres:postgres@localhost:5432/postgres'
const connectionString = (() => {
  if (databaseUrl) return databaseUrl

  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL environment variable must be provided in production')
  }

  console.warn(
    'DATABASE_URL is not set. Using a local placeholder connection string for development.\n' +
      'Configure the Supabase pooled connection string in production environments.'
  )

  return placeholderConnectionString
})()

const adapter = new PrismaPg({
  connectionString,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
