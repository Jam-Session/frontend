<script lang="ts">
	import { onMount } from 'svelte';

	// The result should be between 100 an 1000000
	export const minv = Math.log(100);
	export const maxv = Math.log(1000000);

	export let value = minv;
	export let disabled = false;

	let logslider: HTMLInputElement;

	// position will be between 0 and 100
	const minp = 0;
	const maxp = 100;

	// calculate adjustment factor
	const scale = (maxv - minv) / (maxp - minp);

	function handleInput() {
		const position = parseInt(logslider.value, 10);
		value = Math.floor(Math.exp(minv + scale * (position - minp)));
	}

	let visible = false;
	onMount(() => {
		logslider.value = String((Math.log(value) - minv) / scale);
		visible = true;
	});
</script>

<label>
	<span><slot /></span>
	<input
		class:invisible={!visible}
		type="range"
		min={minp}
		max={maxp}
		on:input={handleInput}
		bind:this={logslider}
		{disabled}
	/>
</label>
