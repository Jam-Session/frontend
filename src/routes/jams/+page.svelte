<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';

	if (browser) {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			goto(`/jams/${coords.latitude}/${coords.longitude}`);
		});
	}
</script>

<div class="container p-4">
	{#if navigating}
		<p class="animate-pulse">Querying for jams...</p>
	{:else}
		<p class="animate-bounce">Please allow geolocation...</p>
	{/if}
</div>
