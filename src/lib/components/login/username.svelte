<script lang="ts">
	import { notifications } from '../toast';

	let fullname: string = '';
	let error: string | null = null;
	$: error ? notifications.send('login', error) : notifications.clear('login');

	const validate = (): boolean => {
		const ok = !!(fullname && fullname.match(/[a-zA-Zs+]{1,100}/gm));
		error = ok ? null : 'Érvénytelen felhasználónév!';
		return ok;
	};

	export let next: () => any;
	export let shown: boolean;
</script>

<div class="pt-2" style={`display: ${shown ? 'block' : 'none'}`}>
	<input required aria-required on:change={validate} type="text" placeholder="Tanuló neve" name="fullname" id="fullname" bind:value={fullname} />
	<div class="center pt-2">
		<button on:click|preventDefault={() => validate() && next()}>Tovább</button>
	</div>
</div>
