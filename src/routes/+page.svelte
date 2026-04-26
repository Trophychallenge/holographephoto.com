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
	<title>Holographe | Your Favorite Photo, Reimagined In Light</title>
	<meta
		name="description"
		content="Upload a photo, preview a premium holographic keepsake in real time, add a personal overlay, and order in seconds."
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
			radial-gradient(circle at top left, rgba(226, 205, 175, 0.12), transparent 22%),
			radial-gradient(circle at 84% 12%, rgba(196, 212, 255, 0.08), transparent 22%),
			radial-gradient(circle at bottom right, rgba(247, 230, 209, 0.06), transparent 26%),
			linear-gradient(180deg, #050506 0%, #0b0b0d 38%, #060607 100%);
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
			linear-gradient(180deg, transparent, rgba(232, 217, 191, 0.02), transparent);
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
