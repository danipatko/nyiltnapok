<script lang="ts">
	import Name from '$lib/components/login/username.svelte';
	import Email from '$lib/components/login/email.svelte';
	import { notifications } from '$lib/components/toast';
	import { applyAction, enhance } from '$app/forms';

	let stage: number = 0;
	let error: string | null = null;
	$: error ? notifications.send('login', error) : notifications.clear('login');
</script>

<header>
	<img src="szlgbp_cimer_g_512.png" alt="SZLG címer" class="logo" />
	<h1>Nyílt napok</h1>
</header>

<section id="login" class="tartalom">
	<h2>bejelentkezés</h2>
	<p>
		Add meg a neved és e-mail címed a jelentkezéshez! A megadott e-mail címre küldeni fogunk egy 8-jegyű kódót, amivel be tudod magadat azonosítani.
		Amennyiben már regisztráltál, ugyanezt a procedúrát követve ismét be tudsz jelentkezni.
	</p>
	<form
		method="POST"
		id="form"
		use:enhance={() => {
			return async ({ result }) => {
				notifications.clear('login');
				if (result.type == 'redirect') applyAction(result);
				else if (result.type == 'invalid') error = result?.data?.msg ?? null;
			};
		}}
	>
		<Name shown={stage == 0} next={() => stage++} />
		<Email shown={stage == 1} />
	</form>
</section>
