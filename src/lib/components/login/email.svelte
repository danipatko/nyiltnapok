<script lang="ts">
	import { validateEmail } from '$lib/util';
	import { onMount } from 'svelte';

	onMount(() => {
		// @ts-ignore
		renderThing();
	});

	const validate = () => {
		const ok = validateEmail(email);
		error = ok ? null : 'Érvénytelen e-mail cím!';
		return ok;
	};

	let error: string | null = null;
	let email: string = '';

	export let shown: boolean;
</script>

<svelte:head>
	<!-- onload=onloadCallback& -->
	<script defer>
		const renderThing = () => {
			grecaptcha.render(document.getElementById('captcha-container'), {
				sitekey: '6LdBqywiAAAAAB7YTVACaXr_BxRUDRm1BJ7B0LkL'
			});
		};
	</script>
	<script src="https://www.google.com/recaptcha/api.js?render=explicit" async></script>
</svelte:head>

{#if shown}
	<p>Adja meg az e-mail címét! A megadott címre küldünk egy visszaigazoló emailt.</p>
	<input on:change={validate} bind:value={email} type="text" name="email" id="email" placeholder="Email cím" />
{/if}

<!-- TOFIX: for some reason, captcha always renders on top of the form and not in the container -->
<div style={`display: ${shown ? 'block' : 'none'};`} id="captcha-container" />

{#if shown}
	<input on:click={(e) => !validateEmail(email) && e.preventDefault()} type="submit" value="Nyomod" />
	{#if error != null}
		<label for="email">{error}</label>
	{/if}
{/if}
