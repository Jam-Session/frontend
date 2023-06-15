import { prisma } from '$lib/db';
import { json } from '@sveltejs/kit';
import { seed } from './candles';

export const GET = async () => {
    await seed(prisma);
    const count = await prisma.candle.count();
    return json({ count });
};