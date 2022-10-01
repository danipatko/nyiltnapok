<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
</script>

<main>
	<h1>Időpont kiválasztása</h1>

	<form
		method="POST"
		id="form"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type == 'redirect') {
					applyAction(result);
				}

				if (result.type == 'invalid') {
					alert(result.data?.msg);
				}
			};
		}}
	>
		<input type="text" name="email" id="email" placeholder="E-mail cím" />
		<input type="password" name="pass" id="pass" placeholder="Jelszó" />
		<button type="submit">Login</button>
	</form>
</main>
