<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_RECAPTCHA_CLIENT_KEY } from '$env/static/public';
	import { validateEmail } from '$lib/util';
	import { get } from 'svelte/store';

	let emailError: string | null = null;
	let fullnameError: string | null = null;
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<main>
	<h1>Nyílt nap regisztráció</h1>
	<form
		action="?"
		method="POST"
		on:change={() => {
			fullnameError = null;
			emailError = null;
		}}
		use:enhance={({ form, data, cancel }) => {
			const { fullname, email } = Object.fromEntries(data);
			if (!fullname) {
				fullnameError = 'Nincs megadva név!';
				return cancel();
			}

			if (!email) {
				emailError = 'Nincs megadva email cím!';
				return cancel();
			}

			if (!validateEmail(email.toString())) {
				fullnameError = 'Érvénytelen email cím!';
				return cancel();
			}

			// validate client-side
			return async ({ result }) => {
				// handle server response
				console.log(result);
				return result;
			};
		}}
	>
		<div class="g-recaptcha" data-sitekey={PUBLIC_RECAPTCHA_CLIENT_KEY} />
		<br />
		<input type="text" name="fullname" id="fullname" placeholder="Tanuló teljes neve" />
		{#if fullnameError}
			<label for="fullname">{fullnameError}</label>
		{/if}
		<br />
		<input type="text" name="email" id="email" placeholder="Email cím" />
		{#if emailError}
			<label for="email">{emailError}</label>
		{/if}
		<br />
		<input type="submit" value="Nyomod" />
	</form>
</main>
