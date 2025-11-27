import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn(
    'DATABASE_URL environment variable is not set. Using a local placeholder connection string.\n' +
      'Please configure a real DATABASE_URL in production environments.'
  )
}

const adapter = new PrismaPg({
  connectionString: databaseUrl ?? 'postgresql://user:password@localhost:5432/postgres',
})

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
