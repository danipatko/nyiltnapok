<script lang="ts">
	import { validateEmail } from '$lib/util';
	import { Turnstile } from 'svelte-turnstile';
	import toast from 'svelte-french-toast';

	const validate = () => {
		const ok = validateEmail(email);
		if (!ok) toast.error('Érvénytelen e-mail cím!');
		return ok;
	};

	let email = '';
	export let shown: boolean;
</script>

<div class="pt-2" style={`display: ${shown ? 'block' : 'none'};`}>
	<div>
		<input on:change={validate} bind:value={email} type="text" name="email" id="email" placeholder="Email cím" />
	</div>

	{#if !import.meta.env.DEV}
		<div class="pt-2">
			<Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITEKEY} theme="light" />
		</div>
	{/if}

	<div class="center pt-2">
		<button on:click={(e) => validate() || e.preventDefault()}>Tovább</button>
	</div>
</div>
