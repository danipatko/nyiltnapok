<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { hasRestParameter } from 'typescript';
	export let data: import('./$types').PageServerData;
</script>

<main>
	<h1>Időpontok és Csoportok</h1>
	<div>
		{#each data.appointments as app}
			<div>{app.label} | {app.groups.length} csoport</div>
			<div>
				<fieldset>
					<legend>Új csoport hozzáadása</legend>
					<form
						action="?/creategroup"
						method="POST"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type == 'invalid') {
									alert(result.data?.msg);
								} else if (result.type == 'success') {
									// @ts-ignore
									app.groups = [...app.groups, result.data];
								}
							};
						}}
					>
						<input style="display: none;" type="text" name="id" value={app.id} />
						<input required aria-required type="text" name="max" placeholder="Csoportlétszám" />
						<button type="submit">Hozzáadás</button>
					</form>
				</fieldset>
			</div>
			<div>
				{#each app.groups as g}
					<div>Csoport #{g.id} ({g.members.length}/{g.maxMemberCount} fő)</div>
					<form
						action="?/deletegroup"
						method="POST"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type == 'invalid') {
									alert(result.data?.msg);
								} else if (result.type == 'success') {
									app.groups = app.groups.filter((x) => x.id != result.data?.id);
								}
							};
						}}
					>
						<input style="display: none;" type="text" name="id" value={g.id} />
						<button type="submit">Törlés</button>
					</form>
					<ul>
						{#each g.members as m}
							<li>{m.fullname} {'<' + m.email + '>'}</li>
						{/each}
					</ul>
				{/each}
			</div>
			<hr />
		{/each}
	</div>

	<h3>Admin felhasználók</h3>
	<div>
		{#each data.admins as admin}
			<div>{admin.fullname} {'<' + admin.email + '>'}</div>
			<form
				action="?/deleteuser"
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type == 'invalid') {
							alert(result.data?.msg);
						} else if (result.type == 'success') {
							data.admins = data.admins.filter((x) => x.id != result.data?.id);
						}
					};
				}}
			>
				<input style="display: none;" type="text" name="id" value={admin.id} />
				<button type="submit">Törlés</button>
			</form>
		{/each}
	</div>
	<fieldset>
		<legend>Új admin felhasználó létrehozása</legend>
		<form
			action="?/createuser"
			method="POST"
			use:enhance={({ form }) => {
				return async ({ result }) => {
					if (result.type == 'invalid') {
						alert(result.data?.msg);
					} else if (result.type == 'success' && result.data) {
						form.reset();
						// @ts-ignore
						data.admins = [...data.admins, result.data];
					}
				};
			}}
		>
			<input aria-required required type="text" name="fullname" placeholder="Felhasználónév" />
			<input aria-required required type="text" name="email" placeholder="E-mail cím" />
			<input aria-required required type="password" name="pass" placeholder="Jelszó" />
			<button type="submit">Hozzáadás</button>
		</form>
	</fieldset>
</main>
