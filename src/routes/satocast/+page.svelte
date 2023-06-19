<script lang="ts">
	import { page } from '$app/stores';
	import Game from './Game.svelte';
	import Usd from '$lib/Usd.svelte';
	import Btc from '$lib/Btc.svelte';
	import { format } from 'date-fns';

	export let data;

	$: type = $page.url.searchParams.get('type');

	let budget = 1e4;
	const { start } = data.bars.at(0)!;
	$: target = budget / data.average;
</script>

{#if type}
	<Game {data} {type} {budget} />
{:else}
	<div class="flex flex-col sm:flex-row gap-4 items-start justify-between p-4">
		<p class="badge variant-ringed-primary">
			{format(start, 'PPppp')}
		</p>
		<p class="text-sm">
			Average price over {data.bars.length} hour period: <em><Usd value={data.average} /></em>
		</p>
	</div>

	<form class="flex flex-col gap-4 p-4">
		<label>
			<span>Budget: <Usd value={budget} /></span>
			<input type="range" bind:value={budget} max={1e5} />
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
