<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	export let data: import('./$types').PageServerData;

	let selected: number = data.selected?.appointmentId ?? 0;
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
				if (result.type == 'success' && result.data) {
					selected = result.data.selected;
				}
				if (result.type == 'invalid') {
					selected = result?.data?.current;
					alert(result?.data?.msg);
				}
			};
		}}
	>
		<fieldset>
			<legend>Válassz egy időpontot</legend>
			<input style="display: none;" type="number" name="day" value={selected} />
			{#each data.appointments as a}
				<div>
					{#if selected == a.id}
						selected
					{/if}
					<button type="submit" on:click={() => (selected = a.id)}>{a.label}</button>
				</div>
			{/each}
			<div>
				<button type="submit" on:click={() => (selected = 0)}>Lemondás</button>
			</div>
		</fieldset>
	</form>
</main>
