import { createRequire } from 'node:module';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const require = createRequire(import.meta.url);
const { PrismaClient } = require('../../generated/prisma');

const adapter = new PrismaMariaDb(process.env.DATABASE_URL || '');

const globalForPrisma = global as unknown as { prisma: InstanceType<typeof PrismaClient> };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { PrismaClient };
export default prisma;
