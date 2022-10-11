<script lang="ts">
	export let data: import('./$types').PageServerData;
	import { applyAction, enhance } from '$app/forms';
	import toast from 'svelte-french-toast';

	let selected: number = data.selected?.appointmentId ?? 0;
	let toSelect: number = 0;
</script>

<main>
	<header class="hide">
		<img src="szlgbp_cimer_g_512.png" alt="" class="logo" />
		<h1>Nyílt napok</h1>
	</header>
	<section id="valasztas" class="tartalom">
		<h1>Válassz időpontot!</h1>
		<p>Egy felhasználó egyszer foglalhat időpontot, egy személyre.</p>
		<form
			method="POST"
			id="form"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type == 'redirect') {
						applyAction(result);
					}
					if (result.type == 'success') {
						selected = toSelect;
						if (result.data) {
							toast.success('Sikeres jelentkezés! A további részletekről emailben értesítünk.', {
								duration: 60_000
							});
						} else {
							toast.success('Sikeres lemondás!', { duration: 20_000 });
						}
					}
					if (result.type == 'invalid') {
						selected = result?.data?.current ?? selected;
						toast.error(result?.data?.msg ?? 'Váratlan hiba történt!');
					}
				};
			}}
		>
			<input style="display: none;" type="number" name="day" value={toSelect} />
			<section id="idopontok" class="tartalom row pt-2">
				{#each data.appointments as a}
					<section>
						<h3>
							{a.label}
						</h3>
						<button class="mt-1" type="submit" on:click={() => (toSelect = selected == a.id ? 0 : a.id)}
							>{selected == a.id ? 'Lemondás' : 'Jelentkezés'}</button
						>
					</section>
				{/each}
			</section>
		</form>
	</section>
</main>
