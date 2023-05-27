<script lang="ts">
	import { enhance } from '$app/forms';
	import { marked } from 'marked';
	import makeLocalStore from '$lib/makeLocalStore';
	import type { ActionData, SubmitFunction } from './$types';

	const psid = makeLocalStore('PSID', '');

	export let form: ActionData;

	let loading = false;
	let promptRef: HTMLInputElement;

	const submitFn: SubmitFunction = function () {
		loading = true;
		return async ({ update }) => {
			loading = false;
			await update();
			setTimeout(() => promptRef?.select(), 1);
		};
	};
</script>

<div class="container p-4">
	<form use:enhance={submitFn} method="POST" class="space-y-4">
		<label>
			<small class="block">1PSID</small>
			{#if form}
				<code class="code">{$psid}</code>
				<input type="hidden" name="token" value={$psid} />
			{:else}
				<input type="password" name="token" bind:value={$psid} required autocomplete="off" />
			{/if}
		</label>

		{#if !loading}
			{#if form?.error}
				<p class="variant-ghost-surface p-2 rounded">{form?.error}</p>
			{/if}

			{#if form?.content}
				<article class="prose rounded variant-ringed-success p-2">
					{@html marked(form.content)}
				</article>
			{/if}
		{/if}

		<div class="flex items-end gap-4">
			<label class="flex-1">
				<small class="block">Prompt</small>
				<input
					type="text"
					class="w-full"
					name="prompt"
					autocomplete="off"
					spellcheck="false"
					required
					bind:this={promptRef}
				/>
			</label>

			<button type="submit" class="btn variant-filled-primary" disabled={loading}>Submit</button>
		</div>

		{#if loading}
			<p class="animate-pulse">Loading...</p>
		{/if}
	</form>
</div>
