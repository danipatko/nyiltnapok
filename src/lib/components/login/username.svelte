<script lang="ts">
	import { notifications } from '../toast';

	let fullname = '';
	let error: string | null = null;
	$: error ? notifications.send('login', error) : notifications.clear('login');

	const validate = (): boolean => {
		const ok = !!(fullname && fullname.match(/[a-zA-Zs+]{1,100}/gm));
		error = ok ? null : 'Érvénytelen felhasználónév!';
		return ok;
	};

	export let shown: boolean;
</script>

<div class="pt-2" style={`display: ${shown ? 'block' : 'none'}`}>
	<input aria-required on:change={validate} type="text" placeholder="Tanuló neve" name="fullname" id="fullname" bind:value={fullname} />
	<div class="center pt-2">
		<button on:click={(e) => validate() || e.preventDefault()} type="submit">Regiszrálás</button>
	</div>
</div>
