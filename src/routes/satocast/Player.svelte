<script lang="ts">
	import Usd from '$lib/Usd.svelte';

	export let name: string;
	export let when: Date;
	export let buy = (w: Date) => false;
	export let price = 0;

	console.log(when, buy);
</script>

<div class="flex-1 bg-orange-200">
	<h2>{name}</h2>
	<p>
		Current price: <Usd value={price} />
	</p>
</div>
