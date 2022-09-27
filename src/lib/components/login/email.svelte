<script lang="ts">
	import { validateEmail } from '$lib/util';
	import { onMount } from 'svelte';

	onMount(() => {
		// @ts-ignore
		renderCaptcha();
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
	<script defer>
		const renderCaptcha = () => {
			grecaptcha.render(document.getElementById('captcha-container'), {
				sitekey: '6LdBqywiAAAAAB7YTVACaXr_BxRUDRm1BJ7B0LkL'
			});
		};
	</script>
	<script src="https://www.google.com/recaptcha/api.js?render=explicit" async></script>
</svelte:head>
<div style={`display: ${shown ? 'block' : 'none'};`}>
	<input on:change={validate} bind:value={email} type="text" name="email" id="email" placeholder="Email cím" />
	<div id="captcha-container" />
	{#if error != null}
		<label for="email">{error}</label>
	{/if}
	<input on:click={(e) => !validateEmail(email) && e.preventDefault()} type="submit" value="Nyomod" />
</div>
