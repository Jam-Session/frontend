import { prisma } from '$lib/db';
import { subHours } from 'date-fns';
import random from 'random';

const BARS = 24; // one hour of data in each candle

export async function load() {
	const first = await prisma.candle.findFirstOrThrow({
		orderBy: { time: 'asc' },
		where: { time: { gt: new Date(2017, 0)}},
		select: { time: true }
	});
	const last = await prisma.candle.findFirstOrThrow({
		orderBy: { time: 'desc' },
		skip: BARS,
		select: { time: true }
	});
	const startDate = new Date(random.int(first.time.valueOf(), subHours(last.time, BARS).valueOf()));

	const result = await prisma.candle.findMany({
		take: BARS,
		where: { time: { gt: startDate } },
		orderBy: { time: 'asc' }
	});

	let lastPrice = 0;

	const bars = result.map(({ time, prices }) => ({
		start: time,
		prices: (JSON.parse(prices) as unknown[]).map((n) => {
			const p = Number(n);
			if (p) {
				return (lastPrice = p);
			}
			return lastPrice;
		})
	}));

	const allPrices = bars.reduce<number[]>((a, b) => [...a, ...b.prices], []);
	const average = allPrices.reduce((a, p) => a + p, 0) / allPrices.length;

	return {
		bars,
		average
	};
}
