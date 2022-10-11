<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import Email from '$lib/components/login/email.svelte';
	import Name from '$lib/components/login/username.svelte';
	import toast from 'svelte-french-toast';

	let stage = 0;
</script>

<header>
	<img src="szlgbp_cimer_g_512.png" alt="SZLG címer" class="logo" />
	<h1>Nyílt napok</h1>
</header>

<section id="login" class="tartalom">
	<h2>Bejelentkezés</h2>
	<p>Add meg az e-mail címed és neved a jelentkezéshez! A megadott e-mail címre küldeni fogunk egy 8-jegyű kódot, amivel azonosítani tudod magad.</p>
	<form
		method="POST"
		id="form"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'redirect') applyAction(result);
				else if (result.type === 'invalid') toast.error(result?.data?.msg ?? 'Hiba történt');
				// @ts-ignore
				else if (result.type === 'success' && result.data === 'continue') stage = 1;
			};
		}}
	>
		<input style="display: none;" name="stage" id="stage" value={stage} />
		<Email shown={stage == 0} />
		<Name shown={stage == 1} />
	</form>
</section>
