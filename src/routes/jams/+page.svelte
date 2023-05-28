<script lang="ts">
	import { browser } from '$app/environment';

	let where: number[];

	if (browser) {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			where = [coords.latitude, coords.longitude];
		});
	}
</script>

<div class="container p-4">
	{#if where}
		<pre class="pre">{JSON.stringify(where)}</pre>
	{:else}
		<p class="animate-bounce">Please allow geolocation...</p>
	{/if}
</div>
