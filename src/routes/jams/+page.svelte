<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	if (browser) {
		navigator.geolocation.getCurrentPosition(({ coords }) => {
			goto(`/jams/${coords.latitude}/${coords.longitude}`);
		});
	}
</script>

<div class="container p-4">
	<p class="animate-bounce">Please allow geolocation...</p>
</div>
