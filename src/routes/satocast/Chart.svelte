<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createChart,
		type ISeriesApi,
		type UTCTimestamp,
		type IChartApi
	} from 'lightweight-charts';
	import { browser } from '$app/environment';
	import { format, fromUnixTime, getUnixTime } from 'date-fns';
	import type { Price } from '@prisma/client';

	export let candles: Price[];

	let el: HTMLObjectElement;
	let chart: IChartApi;
	let series: ISeriesApi<'Candlestick'>;

	if (browser) {
		onMount(() => {
			chart = createChart(el, {
				handleScale: false,
				handleScroll: false,
				autoSize: true,
				crosshair: {
					vertLine: {
						visible: false,
						labelVisible: false
					},
					horzLine: {
						visible: false,
						labelVisible: false
					}
				},
				timeScale: {
					tickMarkFormatter(t: UTCTimestamp) {
						return format(fromUnixTime(t), 'p');
					}
				}
			});
			series = chart.addCandlestickSeries({
				priceFormat: { minMove: 1 },
			});
			update(candles);
		});
	}

	function update(d: Price[]) {
		if (series) {
			series.setData(
				d.map((c) => ({
					...c,
					time: getUnixTime(c.time) as UTCTimestamp
				}))
			);
			chart.timeScale().fitContent();
		}
	}

	$: update(candles);
</script>

<object aria-label="Chart" bind:this={el} class="h-[50vh] w-full" />
