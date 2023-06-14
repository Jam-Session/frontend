import { PrismaClient } from '@prisma/client';
import { seed } from './seed.js';

const prisma = new PrismaClient({
	log: ['info', 'error', 'warn']
});

seed(prisma);
