<script lang="ts">
	import { PUBLIC_RECAPTCHA_CLIENT_KEY } from '$env/static/public';
</script>

<svelte:head>
	<script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<main>
	<form action="?" method="POST">
		<div class="g-recaptcha" data-sitekey={PUBLIC_RECAPTCHA_CLIENT_KEY} />
		<br />
		<input type="text" name="foo" id="foo" />
		<input type="submit" value="Submit" />
	</form>
</main>
