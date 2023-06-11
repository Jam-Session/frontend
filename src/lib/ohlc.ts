export type OHLC = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

let cache: OHLC[];

export async function ohlc() {
	if (!cache) {
    console.warn('CoinGecko API fetch');
		const url = new URL('https://api.coingecko.com/api/v3/coins/bitcoin/ohlc');
		url.searchParams.set('vs_currency', 'usd');
		url.searchParams.set('days', '1');

		const res = await fetch(url);
		const data = (await res.json()) as number[][];

		cache = data.map(([time, open, high, low, close]) => ({
			time,
			open,
			high,
			low,
			close
		}));
	}

	return cache;
}
