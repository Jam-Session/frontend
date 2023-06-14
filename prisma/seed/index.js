import { PrismaClient } from '@prisma/client';
import { seed } from './seed.js';

const prisma = new PrismaClient({
	log: ['info', 'error', 'warn']
});

prisma.candle.count().then(c => {
	if(c) {
		console.log(`Already have ${c} candles`)
	}
	else {
		seed(prisma);
	}
})
