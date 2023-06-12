<script lang="ts">
	import { onMount } from 'svelte';
	import { addSeconds, format } from 'date-fns';
	import Chart from './Chart.svelte';

	export let data;

	let index = 0;
	let when = new Date(data.ohlc[index].time);

	onMount(() => {
		console.log(data.ohlc);
		const interval = setInterval(() => {
			const next = data.ohlc[index + 1];
			if (next) {
				when = addSeconds(when, 1);
				if (when.valueOf() >= next.time.valueOf()) {
					index += 1;
				}
			}
			else {
				clearInterval(interval);
			}
		}, 2);
		return () => clearInterval(interval);
	});

	$: candles = data.ohlc.slice(0, index + 1);
</script>

<div class="container p-4 flex flex-col gap-4 items-start">
	<p class="badge variant-filled-primary">{format(when, 'PPppp')}</p>
	<progress max={data.ohlc.length} value={index} />
	<Chart candles={candles} />
</div>
