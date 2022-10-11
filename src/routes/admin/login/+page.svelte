<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import toast from 'svelte-french-toast';
</script>

<main>
	<h1>Admin login</h1>
	<form
		method="POST"
		id="form"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type == 'redirect') {
					applyAction(result);
				}
				if (result.type == 'invalid') {
					toast.error(result.data?.msg ?? 'Váratlan hiba történt!');
				}
			};
		}}
	>
		<input required aria-required type="text" name="email" id="email" placeholder="E-mail cím" />
		<input required aria-required type="password" name="pass" id="pass" placeholder="Jelszó" />
		<button type="submit">Login</button>
	</form>
</main>
