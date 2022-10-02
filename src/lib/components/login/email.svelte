<script lang="ts">
	import { validateEmail } from '$lib/util';
	import { notifications } from '$lib/components/toast';
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
	$: error ? notifications.send('login', error) : notifications.clear('login');

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

<div class="pt-2" style={`display: ${shown ? 'block' : 'none'};`}>
	<div>
		<input on:change={validate} bind:value={email} type="text" name="email" id="email" placeholder="Email cím" />
	</div>
	<div class="pt-2" id="captcha-container" />

	<div class="center pt-2">
		<button on:click={(e) => !validateEmail(email) && e.preventDefault()} type="submit">Küldés</button>
	</div>
</div>
