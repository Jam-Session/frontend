import { prisma } from '$lib/db';
import { subHours } from 'date-fns';
import random from 'random';

const BARS = 24; // one hour of data in each candle

export async function load() {
	const first = await prisma.candle.findFirstOrThrow({
		orderBy: { time: 'asc' },
		select: { time: true }
	});
	const last = await prisma.candle.findFirstOrThrow({
		orderBy: { time: 'desc' },
		skip: BARS,
		select: { time: true }
	});
	const startDate = new Date(random.int(first.time.valueOf(), subHours(last.time, BARS).valueOf()));

	console.log(startDate);
	const result = await prisma.candle.findMany({
		take: BARS,
		where: { time: { gt: startDate } },
		orderBy: { time: 'asc' }
	});

	let lastPrice = 0;
	return {
		bars: result.map(({ time, prices }) => ({
			start: time,
			prices: (JSON.parse(prices) as unknown[]).map((n) => {
				const p = Number(n);
				if (p) {
					return (lastPrice = p);
				}
				return lastPrice;
			})
		}))
	};
}
