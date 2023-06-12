import { prisma } from '$lib/db';
import random from 'random';
import type { PageServerLoad } from './$types';

const BARS = 60 * 24;

export const load: PageServerLoad = async function () {
	const first = await prisma.price.findFirstOrThrow({ orderBy: { time: 'asc' }, select: { time: true }});
	const last = await prisma.price.findFirstOrThrow({ orderBy: { time: 'desc' }, skip: BARS, select: { time: true }});
	const startDate = new Date(random.int(first.time.valueOf(), last.time.valueOf()));

	console.log(startDate);
	const prices = await prisma.price.findMany({
		take: BARS,
		where: { time: { gt: startDate } }
	});
	return {
		ohlc: prices.map((p) => ({
			...p,
			open: p.open || p.close,
			high: p.high || p.close,
			low: p.low || p.close
		}))
	};
};
