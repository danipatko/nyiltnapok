<script lang="ts">
	import type { ActionData } from '.svelte-kit/types/src/routes/signup/$types';
	import Name from '$lib/components/login/username.svelte';
	import Email from '$lib/components/login/email.svelte';
	import { applyAction, enhance } from '$app/forms';

	let stage: number = 0;
	let error: string | null = null;
</script>

<main>
	<h1>Nyílt nap regisztráció</h1>
	<form
		method="POST"
		id="form"
		use:enhance={() => {
			return async ({ result }) => {
				console.log(result);
				if (result.type == 'redirect') applyAction(result);
				else if (result.type == 'invalid') error = result?.data?.msg ?? null;
			};
		}}
	>
		{#if error != null}
			<div>{error}</div>
		{/if}
		<Name shown={stage == 0} next={() => stage++} />
		<Email shown={stage == 1} />
	</form>
</main>
