<script lang="ts">
	import HomeHero from '$lib/components/home/HomeHero.svelte';
	import PreviewBuilder from '$lib/components/home/PreviewBuilder.svelte';
	import BeforeAfterSection from '$lib/components/home/BeforeAfterSection.svelte';
	import GiftabilitySection from '$lib/components/home/GiftabilitySection.svelte';
	import HowItWorksSection from '$lib/components/home/HowItWorksSection.svelte';
	import PackagingSection from '$lib/components/home/PackagingSection.svelte';
	import FinalCtaSection from '$lib/components/home/FinalCtaSection.svelte';
</script>

<svelte:head>
	<title>Holographe | A Photo You Don’t Just See — You Feel</title>
	<meta
		name="description"
		content="Turn your favorite memory into a shimmering custom keepsake with a live preview builder, optional overlays, and an easy order flow."
	/>
</svelte:head>

<div class="page-shell">
	<HomeHero />
	<PreviewBuilder />
	<BeforeAfterSection />
	<GiftabilitySection />
	<HowItWorksSection />
	<PackagingSection />
	<FinalCtaSection />
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), transparent 24%),
			radial-gradient(circle at 80% 10%, rgba(224, 230, 255, 0.1), transparent 20%),
			radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.08), transparent 28%),
			linear-gradient(180deg, #050505 0%, #0b0b0c 48%, #050505 100%);
	}

	.page-shell {
		min-height: 100vh;
	}
</style>
