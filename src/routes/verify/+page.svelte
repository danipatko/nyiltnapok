<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { notifications } from '$lib/components/toast';
	import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

	const validate = (): boolean => {
		const ok = !!code.match(/[0-9]{8}/gm);
		error = ok ? null : 'Érvénytelen kód.';
		return ok;
	};

	let error: string | null = null;
	$: error ? notifications.send('login', error) : notifications.clear('login');

	let code: string = '';
</script>

<header>
	<img src="szlgbp_cimer_g_512.png" alt="SZLG címer" class="logo" />
	<h1>Nyílt napok</h1>
</header>

<section class="login">
	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				notifications.clear('login');
				if (result.type == 'invalid') error = result?.data?.msg ?? null;
				else if (result.type == 'redirect') applyAction(result);
			};
		}}
	>
		<p>Add meg a 8 jegyű kódot, amelyet a e-mail címedre küldtünk. Figyelem: a kód 2 percen belül lejár! <br /> <a href="/login">Vissza</a></p>
		<div class="center pt-2">
			<input required aria-required type="text" name="code" id="code" placeholder="Kód" bind:value={code} on:change={validate} />
		</div>
		<div class="center pt-2">
			<button on:click={(e) => !validate() && e.preventDefault()} type="submit">Megerősítés</button>
		</div>
	</form>
</section>
