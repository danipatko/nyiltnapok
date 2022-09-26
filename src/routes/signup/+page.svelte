<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import Email from '$lib/components/login/email.svelte';
	import Name from '$lib/components/login/username.svelte';

	let stage: number = 0;
</script>

<main>
	<h1>Nyílt nap regisztráció</h1>
	<form
		action="?"
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				// handle server response
				applyAction(result);
			};
		}}
	>
		<div id="captcha-container" style={`display:${stage == 1 ? 'block' : 'none'};`} />
		<Name shown={stage == 0} next={() => stage++} />
		<Email shown={stage == 1} />
	</form>
</main>
