<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Payment Received | Holographe</title>
	<meta
		name="description"
		content="Your Holographe payment was received. Next, send your photo and customization details if needed."
	/>
</svelte:head>

<section class="section">
	<div class="page-wrap">
		<div class="glass-card status-card">
			<p class="eyebrow">Checkout status</p>
			{#if data.state === 'paid'}
				<h1>Payment received.</h1><p>Your secure checkout payment was verified. Your saved design details are already attached to the order.</p>
			{:else if data.state === 'pending'}
				<h1>Payment is still pending.</h1><p>Stripe has not confirmed payment yet. Do not submit another order unless Stripe shows that the first one failed.</p>
			{:else if data.state === 'missing'}
				<h1>We can’t verify this checkout.</h1><p>Return here from Stripe with the checkout link, or contact support with your receipt.</p>
			{:else}
				<h1>Checkout verification is temporarily unavailable.</h1><p>We cannot confirm payment right now. Check your Stripe receipt before trying again.</p>
			{/if}
			<div class="button-row">
				<a class="button-primary" href="/contact">Contact Christina</a>
				<a class="button-secondary" href={resolve('/gallery')}>See examples</a>
			</div>
		</div>
	</div>
</section>

<style>
	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2.3rem, 5vw, 3.6rem);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 0.96;
	}

	p {
		color: var(--muted);
		line-height: 1.7;
	}

	.status-card {
		display: grid;
		gap: 1rem;
		padding: 1.4rem;
		max-width: 42rem;
	}
</style>
