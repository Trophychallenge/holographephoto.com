<script lang="ts">
	import { onMount } from 'svelte';
	import HomeHero from '$lib/components/home/HomeHero.svelte';
	import PreviewBuilder from '$lib/components/home/PreviewBuilder.svelte';
	import WhyDifferentSection from '$lib/components/home/WhyDifferentSection.svelte';
	import ValueSection from '$lib/components/home/ValueSection.svelte';
	import FinalCtaSection from '$lib/components/home/FinalCtaSection.svelte';

	let isTikTokVisitor = $state(false);

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		const source = `${params.get('utm_source') ?? ''} ${params.get('ref') ?? ''} ${document.referrer}`.toLowerCase();
		isTikTokVisitor = source.includes('tiktok');
	});
</script>

<svelte:head>
	<title>Holograph | Your Favorite Photo, Reimagined In Light</title>
	<meta
		name="description"
		content="Upload a photo and turn it into a light-catching keepsake."
	/>
</svelte:head>

<div class="page-shell">
	<HomeHero {isTikTokVisitor} />
	<PreviewBuilder {isTikTokVisitor} />
	<WhyDifferentSection />
	<ValueSection />
	<FinalCtaSection />
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at 8% 6%, rgba(231, 206, 173, 0.12), transparent 20%),
			radial-gradient(circle at 82% 16%, rgba(225, 236, 255, 0.08), transparent 18%),
			radial-gradient(circle at 50% 100%, rgba(240, 220, 188, 0.06), transparent 24%),
			linear-gradient(180deg, #050505 0%, #090909 42%, #060606 100%);
	}

	.page-shell {
		min-height: 100vh;
		position: relative;
		display: grid;
		gap: 0.5rem;
	}

	.page-shell::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.025), transparent),
			linear-gradient(180deg, transparent, rgba(232, 217, 191, 0.025), transparent);
		mask-image: radial-gradient(circle at center, black 40%, transparent 95%);
	}

	.page-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 20% 18%, rgba(232, 217, 191, 0.05), transparent 16%),
			radial-gradient(circle at 80% 42%, rgba(198, 213, 255, 0.04), transparent 14%),
			radial-gradient(circle at 50% 78%, rgba(255, 255, 255, 0.03), transparent 18%);
		opacity: 0.72;
	}

</style>
