<script lang="ts">
	import { enhance } from '$app/forms';

	export let data: import('./$types').PageServerData;

	let type: 'tsv' | 'csv' = 'csv';
	import { notifications } from '$lib/components/toast';
</script>

<div class="container">
	<h1>Időpontok és Csoportok</h1>

	<div>
		<p>Letöltés mint</p>
		<select bind:value={type} name="exportType">
			<option value="csv">CSV (comma separated)</option>
			<option value="tsv">TSV (tab separated)</option>
		</select>
	</div>

	<div>
		{#each data.appointments as app}
			<div class="appointment-container">
				<fieldset>
					<legend><h3>{app.label} | {app.totalGroups} csoport</h3></legend>
					<div class="group-container">
						{#each app.members as g}
							<div class="group">
								<div>
									<h4>Csoport #{g.id + 1} ({g.members.length}/{app.totalMembers} fő)</h4>
									<a target="_blank" href={`/admin/dl?aid=${app.id}&format=${type}&id=${g.id}`}>Letöltés</a>
									<div />
								</div>
								<ul>
									{#each g.members as m}
										<li>{m.fullname} {'<' + m.email + '>'}</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				</fieldset>
			</div>
		{/each}
	</div>

	<h2>Admin felhasználók</h2>
	<div class="admin-container">
		{#each data.admins as admin}
			<div class="admin">
				<div>{admin.fullname} {'<' + admin.email + '>'}</div>
				<form
					action="?/deleteuser"
					method="POST"
					use:enhance={() => {
						notifications.clearAll();
						return async ({ result }) => {
							if (result.type == 'invalid') {
								notifications.send('deleteuser', result.data?.msg);
							} else if (result.type == 'success') {
								data.admins = data.admins.filter((x) => x.id != result.data?.id);
							}
						};
					}}
				>
					<input style="display: none;" type="text" name="id" value={admin.id} />
					<button type="submit">Törlés</button>
				</form>
			</div>
		{/each}
	</div>
	<fieldset class="new-admin-container">
		<legend>Új admin felhasználó létrehozása</legend>
		<form
			action="?/createuser"
			method="POST"
			use:enhance={({ form }) => {
				return async ({ result }) => {
					notifications.clearAll();
					if (result.type == 'invalid') {
						notifications.send('createuser', result.data?.msg);
					} else if (result.type == 'success' && result.data) {
						form.reset();
						// @ts-ignore
						data.admins = [...data.admins, result.data];
					}
				};
			}}
		>
			<div class="new-admin">
				<input aria-required required type="text" name="fullname" placeholder="Felhasználónév" />
				<input aria-required required type="text" name="email" placeholder="E-mail cím" />
				<input aria-required required type="password" name="pass" placeholder="Jelszó" />
				<button type="submit">Hozzáadás</button>
			</div>
		</form>
	</fieldset>
</div>

<style>
	legend {
		padding: 0 10px;
	}

	fieldset {
		padding: 1rem;
		border: 2px solid lightslategray;
		border-radius: 10px;
	}

	.appointment-container {
		padding: 1rem;
	}

	.new-admin-container {
		display: inline-flex;
	}

	.group-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1rem;
	}

	.new-admin {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}

	.group {
		font-size: smaller;
	}

	ul {
		padding: 1rem;
	}

	.group > div {
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
	}

	.group a,
	.admin button,
	.new-admin button,
	.new-admin input,
	.admin input {
		padding: 0.3rem 0.6rem;
		font-size: inherit;
	}

	.admin {
		display: flex;
		align-items: center;
		justify-content: start;
		gap: 1rem;
	}

	.admin-container {
		margin: 2rem 0;
	}

	h4 {
		padding-right: 1rem;
	}

	li {
		list-style: none;
		white-space: nowrap;
	}

	:global(main) {
		display: block !important;
		margin: 5rem;
		padding: 0 !important;
	}

	a {
		background-color: var(--kek);
		color: var(--feher);
		font-family: 'Merriweather', serif;
		font-weight: 700;
		font-size: inherit;
		border: none;
		border-radius: 75px;
		transition: 0.2s;
		text-decoration: none;
	}
	a:hover {
		background-color: var(--barna);
		cursor: pointer;
	}
</style>
