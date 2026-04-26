<script lang="ts">
	import HomeHero from '$lib/components/home/HomeHero.svelte';
	import PreviewBuilder from '$lib/components/home/PreviewBuilder.svelte';
	import WhyDifferentSection from '$lib/components/home/WhyDifferentSection.svelte';
	import GiftingSection from '$lib/components/home/GiftingSection.svelte';
	import HowItWorksSection from '$lib/components/home/HowItWorksSection.svelte';
	import ValueSection from '$lib/components/home/ValueSection.svelte';
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
	<WhyDifferentSection />
	<GiftingSection />
	<HowItWorksSection />
	<ValueSection />
	<FinalCtaSection />
</div>

<style>
	:global(body) {
		background:
			radial-gradient(circle at top left, rgba(122, 240, 255, 0.16), transparent 22%),
			radial-gradient(circle at 80% 10%, rgba(255, 111, 145, 0.14), transparent 20%),
			radial-gradient(circle at bottom right, rgba(255, 182, 92, 0.12), transparent 24%),
			linear-gradient(180deg, #08111d 0%, #0f1c31 48%, #08111d 100%);
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
			linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent),
			linear-gradient(180deg, transparent, rgba(122, 240, 255, 0.02), transparent);
		mask-image: radial-gradient(circle at center, black 40%, transparent 95%);
	}

	.page-shell::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			radial-gradient(circle at 20% 18%, rgba(122, 240, 255, 0.06), transparent 16%),
			radial-gradient(circle at 80% 42%, rgba(255, 111, 145, 0.05), transparent 14%),
			radial-gradient(circle at 50% 78%, rgba(255, 182, 92, 0.05), transparent 18%);
		opacity: 0.85;
	}
</style>
