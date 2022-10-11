<script lang="ts">
	import toast from 'svelte-french-toast';

	let fullname = '';
	let error: string | null = null;

	const validate = (): boolean => {
		const ok = !!(fullname && fullname.match(/[a-zA-Zs+]{1,100}/gm));
		if (!ok) toast.error('Érvénytelen felhasználónév!');
		return ok;
	};

	export let shown: boolean;
</script>

<div class="pt-2" style={`display: ${shown ? 'block' : 'none'}`}>
	<input aria-required on:change={validate} type="text" placeholder="Tanuló neve" name="fullname" id="fullname" bind:value={fullname} />
	<div class="center pt-2">
		<button on:click={(e) => validate() || e.preventDefault()} type="submit">Regisztrálás</button>
	</div>
</div>
