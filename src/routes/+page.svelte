<script lang="ts">
	import HalloweenFeature from '$lib/components/home/HalloweenFeature.svelte';
</script>

<svelte:head>
	<title>The Holographe Halloween Collection | Holographe</title>
	<meta
		name="description"
		content="Limited seasonal magnetic decor designed to come alive in the light."
	/>
</svelte:head>

<div class="page-shell">
	<HalloweenFeature />
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at 8% 6%, rgba(231, 206, 173, 0.08), transparent 18%),
			radial-gradient(circle at 82% 16%, rgba(225, 236, 255, 0.05), transparent 16%),
			linear-gradient(180deg, #050505 0%, #090909 42%, #060606 100%);
	}

	.page-shell {
		min-height: 100vh;
		position: relative;
		display: grid;
		gap: 0.25rem;
	}

	.page-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.02), transparent);
		mask-image: radial-gradient(circle at center, black 40%, transparent 95%);
	}

	.page-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 20% 18%, rgba(232, 217, 191, 0.04), transparent 16%),
			radial-gradient(circle at 80% 42%, rgba(198, 213, 255, 0.03), transparent 14%);
		opacity: 0.52;
	}
</style>
