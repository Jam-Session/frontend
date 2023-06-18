<script lang="ts">
	import { page } from '$app/stores';
	import Game from './Game.svelte';
	import Usd from '$lib/Usd.svelte';
	export let data;

	$: type = $page.url.searchParams.get('type');

	const target = data.budget / data.average;

	const { format } = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'BTC',
		currencyDisplay: 'name',
		maximumSignificantDigits: 2
	});
</script>

<div class="container p-4 mx-auto">
	{#if type}
		<Game {data} {type} />
	{:else}
		<div class="flex flex-col gap-4 items-center">
			<p>
				Average price over {data.bars.length} hour period: <Usd value={data.average} />
			</p>
			<p>
				With a budget of <Usd value={data.budget} />, target <strong>{format(target)}</strong>
			</p>
			<form class="flex gap-2">
				<select name="type">
					<option>DCA_HOURLY</option>
					<option>LUMP_START</option>
					<option>LUMP_END</option>
				</select>

				<button class="btn variant-filled-primary">Play</button>
			</form>
		</div>
	{/if}
</div>
