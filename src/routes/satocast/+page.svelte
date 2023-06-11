<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { addSeconds, format } from 'date-fns';
	import DefList from '$lib/DefList.svelte';

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
		}, 200);
		return () => clearInterval(interval);
	});

	$: candles = data.ohlc.slice(0, index + 1);
</script>

<div class="container p-4">
	<p class="chip variant-ringed mb-4">{format(when, 'PPppp')}</p>
	<ol class="flex flex-wrap gap-2">
		{#each candles as { time, ...ohlc }}
			<li class="variant-ringed p-2 rounded">
				<h6 class="border-b border-surface-500 text-center mb-2">{format(time, 'pp')}</h6>
				<DefList obj={ohlc} />
			</li>
		{/each}
	</ol>
</div>
