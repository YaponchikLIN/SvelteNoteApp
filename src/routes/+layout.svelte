<script lang="ts">
	import '../app.css';
	import { ToastContainer } from '$lib/components';
</script>

<main>
	<slot />
</main>

<ToastContainer />

<style>
	main {
		min-height: 100vh;
	}
</style>
