<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="my-4 container bg-blue-100 p-4">
	<form method="POST" use:enhance class="space-y-4">
		{#if form?.error}
			<p class="variant-filled-surface p-1 rounded">{form?.error}</p>
		{/if}

		<label>
			<div>1PSID</div>
			<input type="password" name="token" required />
		</label>

		<label>
			<div>Prompt</div>
			<textarea name="prompt" class="w-full" required value={form?.textQuery ?? ''} />
		</label>

		<button type="submit" class="btn variant-filled-primary">Submit</button>
	</form>
</div>
