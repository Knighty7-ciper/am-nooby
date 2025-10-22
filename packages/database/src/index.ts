import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export types
export * from '@prisma/client';

// Export query helpers
export * from './queries/user';
export * from './queries/post';
export * from './queries/comment';
export * from './queries/category';
export * from './queries/analytics';
