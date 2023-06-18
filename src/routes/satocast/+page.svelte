<script lang="ts">
	import { page } from '$app/stores';
	import Game from './Game.svelte';
	import Usd from '$lib/Usd.svelte';
	import Btc from '$lib/Btc.svelte';
	import { format } from 'date-fns';

	export let data;

	$: type = $page.url.searchParams.get('type');

	const { start } = data.bars.at(0)!;
	const target = data.budget / data.average;
</script>

<div class="container p-4 mx-auto">
	{#if type}
		<Game {data} {type} />
	{:else}
		<div class="flex flex-col gap-4 items-center">
			<p class="badge variant-ringed-primary">
				{format(start, 'PPppp')}
			</p>
			<p>
				Average price over {data.bars.length} hour period: <Usd value={data.average} />
			</p>
			<p>
				Budget <Usd value={data.budget} />, target
				<strong><Btc value={target} options={{ maximumSignificantDigits: 2 }} /></strong>
			</p>
			<form class="flex gap-2 items-end">
				<label>
					<span class="block text-xs">Bot behavior:</span>
					<select name="type">
						<option>DCA_HOURLY</option>
						<option>LUMP_START</option>
						<option>LUMP_END</option>
					</select>
				</label>

				<button class="btn variant-filled-secondary">Play</button>
			</form>
		</div>
	{/if}
</div>
