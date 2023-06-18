<script lang="ts">
	import { onMount } from 'svelte';
	import { addMinutes, format, getMinutes, getUnixTime, isBefore, isEqual, isSameHour } from 'date-fns';
	import Chart from './Chart.svelte';
	import Player from './Player.svelte';
	import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
	import type { PageData } from './$types';

	export let data: PageData;
	export let type: string;

  const progressMax = (data.bars.length - 1) * 60;
  const start = data.bars.at(0)?.start!;

  const strategies = Object.entries({
		LUMP_START: { buy(w: Date) { return isEqual(w, start); } },
		LUMP_END: { buy(w: Date) { return isEqual(w, addMinutes(start, progressMax)); } },
		DCA_HOURLY: { buy(w: Date) { return getMinutes(w) === 0; } }
	}).reduce<Record<string, { name: string, buy: (w: Date)=> boolean }>>(
		(a, [k, v]) => ({ ...a, [k]: { ...v, name: k } }),
		{}
	);

	const strategy = strategies[type] || strategies.DCA_HOURLY;

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

	$: candlesticks = data.bars.reduce<CandlestickData[]>((memo, bar, index) => {
		const time = getUnixTime(bar.start) as UTCTimestamp;
		if (index > hour) return memo;
		const prices = bar.prices.slice(
			0,
			isSameHour(when, bar.start) ? getMinutes(when) + 1 : undefined
		);
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

	$: progressVal = hour * 60 + getMinutes(when);
	$: price = candlesticks[candlesticks.length - 1].close;
</script>

<div class="flex flex-col gap-4 items-start">
	<p class="badge variant-filled-primary">{format(when, 'PPppp')}</p>
	<progress max={progressMax} value={progressVal} />
	<Chart data={candlesticks} />
  <div class="flex w-full gap-4">
    <Player name={strategy.name} {price} {when} buy={strategy.buy} />
    <Player name="You" {price} {when} />  
  </div>
</div>
