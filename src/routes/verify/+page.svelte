<script lang="ts">
	import type { ActionData } from '.svelte-kit/types/src/routes/verify/$types';

	const validate = (): boolean => {
		const ok = !!code.match(/[0-9]{8}/gm);
		error = ok ? null : 'Érvénytelen kód.';
		return ok;
	};

	let error: string | null = null;
	let code: string = '';

	export let form: ActionData;
</script>

<main>
	<h1>E-mail cím megerősítése</h1>
	{#if form && form?.success}
		<p>Sikeres regisztráció! Válassz <a href="/">időpontot</a>!</p>
	{:else}
		<form method="POST">
			<p>Adja meg a 8 jegyű kódot, amelyet a megadott e-mail címre küldtünk. <a href="/signup">Vissza</a></p>
			{#if error != null || form?.msg != null}
				<label for="code">{form?.msg ?? error}</label>
			{/if}
			<input required aria-required type="text" name="code" id="code" placeholder="Kód" bind:value={code} on:change={validate} />
			<br />
			<input on:click={(e) => !validate() && e.preventDefault()} type="submit" value="Megerősítés" />
		</form>
	{/if}
</main>
