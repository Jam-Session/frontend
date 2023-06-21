<script lang="ts">
	import { page } from '$app/stores';
	import Game from './Game.svelte';
	import Usd from '$lib/Usd.svelte';
	import Btc from '$lib/Btc.svelte';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	export let data;

	$: type = $page.url.searchParams.get('type');

	let budget = 1e4;
	const { start } = data.bars.at(0)!;
	$: target = budget / data.average;

	let logslider: HTMLInputElement;
	// position will be between 0 and 100
	const minp = 0;
	const maxp = 100;
	// The result should be between 100 an 1000000
	const minv = Math.log(100);
	const maxv = Math.log(1000000);
	// calculate adjustment factor
	const scale = (maxv - minv) / (maxp - minp);

	function setbudget() {
		const position = parseInt(logslider.value, 10);
		budget = Math.floor(Math.exp(minv + scale * (position - minp)));
	}

	onMount(() => {
		if (logslider) {
			logslider.value = String((Math.log(budget) - minv) / scale);
		}
	});
</script>

{#if type}
	<Game {data} {type} {budget} />
{:else}
	<div class="flex flex-col sm:flex-row gap-4 items-baseline justify-between p-4">
		<div>
			<span class="badge variant-ringed-primary">{format(start, 'PPppp')}</span>
			<a data-sveltekit-reload href="?{format(start, 't')}" class="anchor text-xs ml-1">reload</a>
		</div>
		<p class="text-sm">
			Average price over {data.bars.length} hour period: <em><Usd value={data.average} /></em>
		</p>
	</div>

	<form class="flex flex-col gap-4 p-4">
		<label>
			<span>Budget: <Usd value={budget} /></span>
			<input type="range" min={0} max={100} on:input={setbudget} bind:this={logslider} />
		</label>

		<label>
			<span>Bot behavior:</span>
			<select name="type" class="w-full">
				<option>DCA_HOURLY</option>
				<option>LUMP_START</option>
				<option>LUMP_END</option>
			</select>
		</label>

		<button class="btn variant-filled-secondary">Play</button>
	</form>

	<p class="text-center">
		Target: <strong><Btc value={target} options={{ maximumSignificantDigits: 2 }} /></strong>
	</p>
{/if}
