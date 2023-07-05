<script lang="ts">
	import Usd from '$lib/Usd.svelte';
	import { Howl } from 'howler';

	export let doPurchase: (n: number) => void;
	export let balance = 0;

	const btns = balance
		.toString()
		.split('')
		.map((c, i, a) => Math.pow(10, a.length - (i + 1)))
		.reverse()
		.slice(-3);

	const sound = new Howl({
		src: ['/sounds/cash.mp3']
	});

	function handleClick(amount: number) {
		sound.play();
		doPurchase(amount);
	}
</script>

<fieldset class="btn-group-vertical md:btn-group variant-ghost-primary rounded-lg">
	{#each btns as amount}
		<button
			data-amount={amount}
			on:click|preventDefault={() => handleClick(amount)}
			disabled={amount > balance}
		>
			<Usd value={amount} options={{ notation: 'compact', compactDisplay: 'short' }} />
		</button>
	{/each}
</fieldset>
