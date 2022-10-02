<script lang="ts">
	import { notifications } from '$lib/components/toast';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
</script>

<div class="notifications">
	{#each Array.from($notifications) as notification (notification[0])}
		<div animate:flip class="toast" transition:fly={{ y: 30 }}>
			<div class="content">{notification[1]}</div>
		</div>
	{/each}
</div>

<style>
	.notifications {
		position: fixed;
		top: 10px;
		left: 0;
		right: 0;
		margin: 0 auto;
		padding: 0;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		pointer-events: none;
	}

	.toast {
		flex: 0 0 auto;
		margin-bottom: 10px;
		background-color: red;
	}

	.content {
		padding: 10px;
		display: block;
		color: white;
		font-weight: 500;
	}
</style>
