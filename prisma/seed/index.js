import { PrismaClient } from '@prisma/client';
import { seed } from './seed.js';

const prisma = new PrismaClient();
prisma.price.count().then((count) => {
	if (!count) {
		seed(prisma);
	} else {
		console.log(`Already have ${count} datapoints`);
	}
});
