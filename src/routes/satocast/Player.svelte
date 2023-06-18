<script lang="ts">
	import Btc from '$lib/Btc.svelte';
	import Usd from '$lib/Usd.svelte';
	import { format, formatISO } from 'date-fns';
	import { fade } from 'svelte/transition';

	export let name: string;
	export let when: Date;
	export let budget = 0;
	export let buy: null | ((w: Date) => number) = null;
	export let price = 0;
	export let gameOver = false;

	type Purchase = {
		when: Date;
		usdAmount: number;
		satAmount: number;
	};

	let purchases: Purchase[] = [];
	let balance = budget;
	let amount = budget / 10;

	function doPurchase(usdAmount: number) {
		if (balance > 0 && usdAmount <= balance) {
			balance -= usdAmount;
			purchases = [
				...purchases,
				{ when, usdAmount, satAmount: Math.floor((usdAmount / price) * 1e8) }
			];
			amount = Math.min(balance, usdAmount);
		}
	}

	function handleBuyClick() {
		doPurchase(amount);
	}

	function scrollTo(el: HTMLElement) {
		el.scrollIntoView();
	}

	function maybeBuy(w: Date) {
		const a = buy ? buy(w) : 0;
		if (a > 0) {
			doPurchase(Math.round(Math.min(budget * a, balance)));
		}
	}

	$: maybeBuy(when);
	$: gameOver && doPurchase(balance);
	$: totalSats = purchases.reduce((a, p) => a + p.satAmount, 0);
	$: average = (budget - balance) / (totalSats / 1e8);
</script>

<h2 class="border-b mb-2">{name}</h2>

<dl class="grid grid-cols-2 gap-x-4 mb-2 items-baseline">
	<dt class="text-xs">Fiat balance:</dt>
	<dd class="text-right">
		<span class="badge variant-glass-tertiary"><Usd value={balance} /></span>
	</dd>
	<dt class="text-xs">Amount stacked:</dt>
	<dd class="text-right">
		<span class="badge variant-glass-secondary"><Btc value={totalSats / 1e8} /></span>
	</dd>
	{#if !isNaN(average)}
		<dt class="text-xs">Average paid:</dt>
		<dd class="text-right">
			<span class="badge variant-ghost-primary"><Usd value={average} /></span>
		</dd>
	{/if}
</dl>

{#if !buy && !gameOver}
	<div class="flex gap-2 items-start justify-between mb-2">
		<button
			class="btn variant-filled-secondary btn-sm"
			on:click={handleBuyClick}
			disabled={balance <= 0}>Buy</button
		>

		<label class="flex-1">
			<span class="block text-xs">
				<Usd value={amount} /> &approx; <Btc
					value={amount / price}
					options={{ maximumSignificantDigits: 4, minimumSignificantDigits: 4 }}
				/>
			</span>
			<input type="range" min={1} max={balance} bind:value={amount} />
		</label>
	</div>
{/if}

<ol class="text-sm max-h-40 overflow-auto">
	{#each purchases as purchase}
		<li class="flex items-center variant-soft-surface p-2 mt-px" use:scrollTo in:fade>
			<span class="text-xs">
				<Usd value={purchase.usdAmount} /> @
				<time datetime={formatISO(purchase.when)}>{format(purchase.when, 'p')}</time>
			</span>
			<span class="flex-1 ml-2 text-right">
				<Btc value={purchase.satAmount / 1e8} />
			</span>
		</li>
	{/each}
</ol>
