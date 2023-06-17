async function main() {
	const { PrismaClient } = await import('@prisma/client');
	const { seed } = await import('./candles.js');
	
	const prisma = new PrismaClient({
		log: ['info', 'error', 'warn']
	});
	
	seed(prisma);	
}

main();
