import { ohlc } from '$lib/ohlc';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async function () {
	return {
		ohlc: await ohlc()
	};
};
