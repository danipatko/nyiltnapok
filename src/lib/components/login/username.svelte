<script lang="ts">
	let fullname: string = '';
	let error: string | null = null;

	const validate = (): boolean => {
		const ok = !!(fullname && fullname.match(/[a-zA-Zs+]{1,100}/gm));
		error = ok ? null : 'Érvénytelen felhasználónév!';
		return ok;
	};

	export let next: () => any;
	export let shown: boolean;
</script>

<div style={`display: ${shown ? 'block' : 'none'}`}>
	{#if error != null}
		<label for="fullname">{error}</label>
	{/if}
	<input required aria-required on:change={validate} type="text" placeholder="Tanuló neve" name="fullname" id="fullname" bind:value={fullname} />
	<button on:click|preventDefault={() => validate() && next()}>Tovább</button>
</div>
