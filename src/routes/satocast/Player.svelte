<script lang="ts">
	import Btc from '$lib/Btc.svelte';
	import Usd from '$lib/Usd.svelte';
	import { format, formatISO } from 'date-fns';
	import { fade } from 'svelte/transition';
	import BuyBtns from './BuyBtns.svelte';

	export let name: string;
	export let when: Date;
	export let budget = 0;
	export let buy: null | ((w: Date) => number) = null;
	export let price = 0;
	export let gameOver = false;

	export let totalSats = 0;

	type Purchase = {
		when: Date;
		usdAmount: number;
		satAmount: number;
	};

	let purchases: Purchase[] = [];
	let balance = budget;
	let average = NaN;

	function doPurchase(usdAmount: number) {
		if (balance > 0 && usdAmount <= balance) {
			balance -= usdAmount;
			const satAmount = Math.floor((usdAmount / price) * 1e8);
			purchases = [
				...purchases,
				{ when, usdAmount, satAmount }
			];
			totalSats += satAmount;
			average = (budget - balance) / (totalSats / 1e8);
		}
	}

	function maybeBuy(w: Date) {
		const a = buy ? buy(w) : 0;
		if (a > 0) {
			doPurchase(Math.round(Math.min(budget * a, balance)));
		}
	}

	$: gameOver ? doPurchase(balance) : maybeBuy(when);
</script>

<section class="basis-1/2 flex flex-col items-start">
	<h2 class="border-b w-full">{name}</h2>

	<div class="flex my-2 gap-2 items-start justify-between w-full">
		<dl class="grid gap-x-2 grid-cols-[auto_1fr] items-baseline">
			{#if !gameOver}
				<dt>Fiat balance:</dt>
				<dd>
					<span class="badge variant-glass-warning"><Usd value={balance} /></span>
				</dd>
			{/if}
			<dt>Amount stacked:</dt>
			<dd>
				<span class="badge variant-ringed"><Btc value={totalSats / 1e8} /></span>
			</dd>
			{#if !isNaN(average)}
				<dt>Average paid:</dt>
				<dd>
					<span class="badge variant-filled-tertiary"><Usd value={average} /></span>
				</dd>
			{/if}
		</dl>

		{#if !buy && !gameOver}
			<BuyBtns {doPurchase} {balance} />
		{/if}
	</div>

	<ol class="flex flex-col-reverse w-full text-xs font-mono whitespace-nowrap">
		{#each purchases as purchase}
			{@const btcAmount = purchase.satAmount / 1e8}
			<li class="variant-soft-surface px-1 gap-2 mb-px flex" in:fade>
				<time datetime={formatISO(purchase.when)} class="basis-1/3 text-ellipsis overflow-hidden"
					>{format(purchase.when, 'p')}</time
				>
				<span class="flex-1 font-bold text-right">
					<span class="hidden md:inline font-normal"><Usd value={purchase.usdAmount} /> =</span>
					<Btc value={btcAmount} options={{ minimumFractionDigits: 8 }} />
				</span>
			</li>
		{/each}
	</ol>
</section>

<style lang="postcss">
	dt {
		@apply text-sm whitespace-nowrap text-ellipsis overflow-hidden;
	}
</style>
