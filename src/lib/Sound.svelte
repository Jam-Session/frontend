<script lang="ts">
	import { Howl } from 'howler';
	import { onMount } from 'svelte';

	export let src = '';

	onMount(() => {
		if (src) {
			new Howl({ src, autoplay: true });
		}
	});
</script>
