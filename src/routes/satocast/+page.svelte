<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { addSeconds, format } from 'date-fns';
	import Chart from './Chart.svelte';

	export let data: PageData;
	let index = 0;
	let when = new Date(data.ohlc[index].time);

	onMount(() => {
		const interval = setInterval(() => {
			const next = data.ohlc[index + 1];
			if (next) {
				when = addSeconds(when, 60 * 60);
				if (when.valueOf() >= next.time) {
					index += 1;
				}
			}
			else {
				clearInterval(interval);
			}
		}, 500);
		return () => clearInterval(interval);
	});

	$: candles = data.ohlc.slice(0, index + 1);
</script>

<div class="container p-4 flex flex-col gap-4 items-start">
	<p class="badge variant-filled-primary">{format(when, 'PPppp')}</p>
	<Chart candles={candles} />
</div>
