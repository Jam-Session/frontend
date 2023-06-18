<script lang="ts">
	import { onMount } from 'svelte';
	import {
		addMinutes,
		format,
		getMinutes,
		getUnixTime,
		isBefore,
		isEqual,
		isSameHour
	} from 'date-fns';
	import Chart from './Chart.svelte';
	import Player from './Player.svelte';
	import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
	import type { PageData } from './$types';

	export let data: PageData;
	export let type: string;

	const progressMax = (data.bars.length - 1) * 60;
	const start = data.bars.at(0)?.start!;

	const strategies = Object.entries({
		LUMP_START: (w: Date) => (isEqual(w, start) ? 1 : 0),
		LUMP_END: (w: Date) => (isEqual(w, addMinutes(start, progressMax)) ? 1 : 0),
		DCA_HOURLY: (w: Date) => (getMinutes(w) === 0 ? 1 / data.bars.length : 0)
	}).reduce<Record<string, { name: string; buy: (w: Date) => number }>>(
		(a, [k, buy]) => ({ ...a, [k]: { buy, name: k } }),
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

	$: progress = (hour * 60 + getMinutes(when)) / progressMax;
	$: price = candlesticks[candlesticks.length - 1].close;
	$: gameOver = progress >= 1;
</script>

<div class="flex flex-col gap-4 items-center">
	<p class={`badge ${gameOver ? 'variant-ringed-tertiary' : 'variant-filled-primary'}`}>
		{format(when, 'PPppp')}
	</p>
	<progress value={progress} />
	<Chart data={candlesticks} />
	<div class="flex w-full gap-4">
		<div class="flex-1">
			<Player name={strategy.name} {price} {when} buy={strategy.buy} budget={data.budget} />
		</div>
		<div class="flex-1">
			<Player name="Player" {price} {when} budget={data.budget} {gameOver} />
		</div>
	</div>
</div>
