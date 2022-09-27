<script lang="ts">
	import { applyAction, enhance } from '$app/forms';

	const validate = (): boolean => {
		const ok = !!code.match(/[0-9]{8}/gm);
		error = ok ? null : 'Érvénytelen kód.';
		return ok;
	};

	let error: string | null = null;
	let code: string = '';
</script>

<main>
	<h1>E-mail cím megerősítése</h1>
	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type == 'invalid') error = result?.data?.msg ?? null;
				else if (result.type == 'redirect') applyAction(result);
			};
		}}
	>
		<p>Add meg a 8 jegyű kódot, amelyet a e-mail címedre küldtünk. Figyelem: a kód 2 percen belül lejár! <br /> <a href="/signup">Vissza</a></p>
		{#if error != null}
			<label for="code">{error}</label>
		{/if}
		<input required aria-required type="text" name="code" id="code" placeholder="Kód" bind:value={code} on:change={validate} />
		<br />
		<input on:click={(e) => !validate() && e.preventDefault()} type="submit" value="Megerősítés" />
	</form>
</main>
