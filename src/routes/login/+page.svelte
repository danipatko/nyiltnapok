<script lang="ts">
	import Name from '$lib/components/login/username.svelte';
	import Email from '$lib/components/login/email.svelte';
	import { applyAction, enhance } from '$app/forms';

	let stage: number = 0;
	let error: string | null = null;
</script>

<main>
	<h1>Nyílt nap jelentkezés</h1>
	<p>
		Add meg a neved és e-mail címed a jelentkezéshez! A megadott e-mail címre küldeni fogunk egy 8-jegyű kódót, amivel be tudod magadat azonosítani.
		Amennyiben már regisztráltál, ugyanezt a procedúrát követve ismét be tudsz jelentkezni.
	</p>
	<form
		method="POST"
		id="form"
		use:enhance={() => {
			return async ({ result }) => {
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
