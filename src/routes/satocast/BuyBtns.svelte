<script lang="ts">
	import Usd from '$lib/Usd.svelte';

	export let doPurchase: (n: number) => void;
	export let balance = 0;

	let btns = balance
		.toString()
		.split('')
		.map((c, i, a) => Math.pow(10, a.length - (i + 1)))
    .reverse()
    .slice(-3);
</script>

<fieldset class="btn-group-vertical md:btn-group variant-ghost-primary rounded-lg">
	{#each btns as amount}
		<button
			data-amount={amount}
			on:click|preventDefault={() => doPurchase(amount)}
			disabled={amount > balance}
		>
			<Usd value={amount} options={{ notation: 'compact', compactDisplay: 'short' }} />
		</button>
	{/each}
</fieldset>
