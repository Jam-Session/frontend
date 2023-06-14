<script lang="ts">
	import { onMount } from 'svelte';
	import {
		createChart,
		type ISeriesApi,
		type UTCTimestamp,
		type IChartApi,
		type CandlestickData
	} from 'lightweight-charts';
	import { browser } from '$app/environment';
	import { format, fromUnixTime, getUnixTime } from 'date-fns';

	export let data: CandlestickData[];

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
			series = chart.addCandlestickSeries();
			series.setData(data);
		});
	}

	function update(d: typeof data) {
		const latest = d.at(-1);
		if (series && latest) {
			series.update(latest);
			chart.timeScale().fitContent();
		}
	}

	$: update(data);
</script>

<object aria-label="Chart" bind:this={el} class="h-[50vh] w-full" />
