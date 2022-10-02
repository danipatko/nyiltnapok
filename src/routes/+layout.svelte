<script lang="ts">
	import Toast from '$lib/components/toast.svelte';
	import '../app.css';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
	<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>
<Toast />

<main>
	<slot />
</main>

<!-- <footer>
	<p>weboldal: valamiért@ezlétezik.hu</p>
	<p>szervezés: valamiért@ezislétezik.hu</p>
</footer> -->
