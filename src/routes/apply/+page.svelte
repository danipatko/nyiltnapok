<script lang="ts">
	import { notifications } from '$lib/components/toast';
	export let data: import('./$types').PageServerData;
	import { applyAction, enhance } from '$app/forms';

	let selected: number = data.selected?.appointmentId ?? 0;
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
					notifications.clearAll();
					if (result.type == 'redirect') {
						applyAction(result);
					}
					if (result.type == 'success' && result.data) {
						selected = result.data.selected;
					}
					if (result.type == 'invalid') {
						selected = result?.data?.current;
						notifications.send('apply', result?.data?.msg);
					}
				};
			}}
		>
			<input style="display: none;" type="number" name="day" value={selected} />

			<section id="idopontok" class="tartalom row">
				{#each data.appointments as a}
					<section>
						<h3>
							{a.label}
							<!-- ({a.groups.reduce((prev, curr) => prev + curr._count.members, 0)} / {data.appointmentMaxSlots.find(
								(x) => x.appointmentId == a.id
							)?._sum.maxMemberCount}) -->
						</h3>
						<button type="submit" on:click={() => (selected = selected == a.id ? 0 : a.id)}>{selected == a.id ? 'Lemondás' : 'Jelentkezés'}</button>
					</section>
				{/each}
			</section>
		</form>
	</section>
</main>
