<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	const validate = (): boolean => {
		const ok = !!code.match(/[0-9]{8}/gm);
		error = ok ? null : 'Érvénytelen kód.';
		return ok;
	};

	let error: string | null = null;
	let code: string = '';

	onMount(() => {
		url = window.location.search;
	});
	let url: string = '?';
</script>

<main>
	<h1>E-mail cím megerősítése</h1>
	<form
		action={url}
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				console.log(result);
			};
		}}
	>
		<p>Adja meg a 8 jegyű kódot, amelyet a megadott e-mail címre küldtünk. <a href="/signup">Vissza</a></p>
		{#if error != null}
			<label for="code">{error}</label>
		{/if}
		<input required aria-required type="text" name="code" id="code" placeholder="Kód" bind:value={code} on:change={validate} />
		<br />
		<input on:click={(e) => !validate() && e.preventDefault()} type="submit" value="Megerősítés" />
	</form>
</main>
