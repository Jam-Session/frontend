<script lang="ts">
	import { onMount } from 'svelte';
	import {
		addMinutes,
		format,
		getMinutes,
		getUnixTime,
		isBefore,
		isSameHour
	} from 'date-fns';
	import Chart from './Chart.svelte';
	import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';

	export let data;

	let hour = 0;
	let when = data.bars[hour].start;

	onMount(() => {
		const interval = setInterval(() => {
			const next = data.bars.at(hour + 1);
			if (next) {
				when = addMinutes(when, 1);
				if (!isBefore(when, next.start)) {
					hour += 1;
				}
			} else {
				clearInterval(interval);
			}
		}, 100);
		return () => clearInterval(interval);
	});

	$: candlesticks = data.bars.reduce<CandlestickData[]>((memo, bar) => {
			const time = getUnixTime(bar.start) as UTCTimestamp;
			let prices = bar.prices;
			if (!isBefore(bar.start, when)) {
				if (isSameHour(when, bar.start)) {
					prices = prices.slice(0, getMinutes(when)+1);
				} else {
					return [...memo];
				}
			}
			return [
				...memo,
				{
					time,
					open: Number(prices.at(0)),
					close: Number(prices.at(-1)),
					high: Math.max(...prices),
					low: Math.min(...prices)
				}
			];
		}, []);

		$: console.log(candlesticks.at(-1)?.close);
</script>

<div class="container p-4 flex flex-col gap-4 items-start">
	<p class="badge variant-filled-primary">{format(when, 'PPppp')}</p>
	<progress max={data.bars.length - 1} value={hour} />
	<Chart data={candlesticks} />
</div>
