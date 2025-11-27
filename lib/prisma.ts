import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL
const connectionString = (() => {
  if (databaseUrl) return databaseUrl

  console.warn(
    'DATABASE_URL environment variable is not set. Using a local placeholder connection string.\n' +
      'Configure the Supabase pooled connection string in production environments.'
  )

  return 'postgresql://postgres:postgres@localhost:5432/postgres'
})()

const adapter = new PrismaPg({
  connectionString,
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
