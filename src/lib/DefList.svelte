<script lang="ts">
	export let obj: Record<string | number, unknown>;
</script>

<dl class="grid grid-cols-2">
	{#each Object.entries(obj) as [key, val]}
		<dt class="font-mono mr-4">{key}</dt>
		<dd class="text-right">{val}</dd>
	{/each}
</dl>
