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
		}, 50);
		return () => clearInterval(interval);
	});

	$: candlesticks = data.bars.reduce<CandlestickData[]>((memo, bar, index) => {
			const time = getUnixTime(bar.start) as UTCTimestamp;
			if(index > hour) return memo;
			const prices = bar.prices.slice(0, isSameHour(when, bar.start) ? getMinutes(when)+1 : undefined);
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
</script>

<div class="container p-4 flex flex-col gap-4 items-start">
	<p class="badge variant-filled-primary">{format(when, 'PPppp')}</p>
	<progress max={(data.bars.length - 1)*60} value={(hour*60)+getMinutes(when)} />
	<Chart data={candlesticks} />
</div>
