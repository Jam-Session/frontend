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
	import { Howl } from 'howler';
	import Chart from './Chart.svelte';
	import Player from './Player.svelte';
	import type { CandlestickData, UTCTimestamp } from 'lightweight-charts';
	import type { PageData } from './$types';
	import { fly } from 'svelte/transition';

	export let data: PageData;
	export let budget: number;
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
	let speed = 22;

	function getEmoji(s: number) {
		return s > 40 ? '🏎️' : s > 30 ? '🚴' : s > 20 ? '🏃🏻‍♂️' : s > 10 ? '🚶🏻' : '🐌';
	}

	const openSound = new Howl({
		src: ['open-444547.mp3']
	});

	const overSound = new Howl({
		src: ['over-530662.mp3']
	});

	function loop() {
		const next = data.bars.at(hour + 1);
		if (next) {
			when = addMinutes(when, 1);
			if (!isBefore(when, next.start)) {
				hour += 1;
			}
			setTimeout(loop, (1 / speed) * 420);
		}
		else {
			overSound.play();
		}
	}

	onMount(() => {
		openSound.play();
		loop();
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

	let botSats = 0;
	let playerSats = 0;

	$: progress = (hour * 60 + getMinutes(when)) / progressMax;
	$: price = candlesticks[candlesticks.length - 1].close;
	$: gameOver = progress >= 1;
	$: ratio = playerSats / botSats;
</script>

<div class="flex flex-col h-full">
	{#if gameOver}
		<p class="p-4 text-center" in:fly={{ x: -100 }}>
			{#if ratio > 1}
				🏆 Player stacked
				<strong
					>{(ratio - 1).toLocaleString(undefined, {
						style: 'percent',
						minimumFractionDigits: 2
					})}</strong
				>
			{:else}
				🤦 {strategy.name} stacked
				<strong
					>{(1 / ratio - 1).toLocaleString(undefined, {
						style: 'percent',
						minimumFractionDigits: 2
					})}</strong
				>
			{/if}
			more -
			<a href="/satocast" class="anchor">try again</a>
		</p>
	{:else}
		<div class="p-4 flex w-full items-baseline justify-between gap-4">
			<span class="badge variant-filled-primary">
				{format(when, 'PP')}
			</span>
			<progress value={progress} class="basis-3/4" />
			<strong class="text-xs whitespace-nowrap">
				candle {hour + 1} of {data.bars.length}
			</strong>
			<input
				class="w-24 translate-y-1"
				bind:value={speed}
				type="range"
				min={2}
				max={42}
				step={10}
			/>
			<span>
				{getEmoji(speed)}
			</span>
		</div>
	{/if}

	<div class="basis-1/2 border-t">
		<Chart data={candlesticks} />
	</div>

	<div class="flex flex-col gap-4 p-4">
		<Player name="Player" {price} {when} {budget} {gameOver} bind:totalSats={playerSats} />

		<Player
			name={strategy.name}
			{price}
			{when}
			{gameOver}
			buy={strategy.buy}
			{budget}
			bind:totalSats={botSats}
		/>
	</div>
</div>
