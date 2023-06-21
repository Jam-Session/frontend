<script lang="ts">
	import { onMount, tick } from 'svelte';
	import {
		createChart,
		type ISeriesApi,
		type UTCTimestamp,
		type IChartApi,
		type CandlestickData
	} from 'lightweight-charts';
	import { browser } from '$app/environment';
	import { format, fromUnixTime } from 'date-fns';
	import { modeCurrent } from '@skeletonlabs/skeleton';

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
						return format(fromUnixTime(t), 'ha');
					}
				}
			});
			series = chart.addCandlestickSeries();
			series.setData(data);

			return modeCurrent.subscribe(async (lightMode) => {
				await tick();
				const s = getComputedStyle(el);
				function rgba(cssvar: string) {
					return `rgba(${s.getPropertyValue(cssvar)})`;
				}
				const gridColor = rgba(lightMode ? '--color-surface-300' : '--color-surface-800');
				const textColor = rgba(lightMode ? '--theme-font-color-base' : '--theme-font-color-dark');
				const borderColor = s.getPropertyValue('border-color');
				chart.applyOptions({
					layout: {
						background: { color: 'transparent' },
						textColor
					},
					rightPriceScale: {
						borderColor
					},
					timeScale: {
						borderColor
					},
					grid: {
						vertLines: { color: gridColor },
						horzLines: { color: gridColor }
					}
				});
			});
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

<object aria-label="Chart" bind:this={el} class="w-full h-full" />
