import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log queries only in development; in production only errors
const logLevel: any[] = process.env.NODE_ENV === 'production'
  ? ['error', 'warn']
  : ['query', 'error', 'warn']

// Cache the singleton even in production for serverless reuse
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logLevel,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
