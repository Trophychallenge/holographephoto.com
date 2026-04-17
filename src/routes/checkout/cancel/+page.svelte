<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Checkout Canceled | Holographe</title>
	<meta name="description" content="Your Holographe checkout was canceled. No payment was taken." />
</svelte:head>

<section class="section">
	<div class="page-wrap">
		<div class="glass-card status-card">
			<p class="eyebrow">Checkout canceled</p>
			<h1>No payment was taken.</h1>
			<p>
				Your order was not completed. You can return to pricing and try again, or contact Holographe
				if you need a custom quote.
			</p>
			<div class="button-row">
				<a class="button-primary" href={resolve('/prices')}>Back to checkout</a>
				<a class="button-secondary" href={resolve('/contact')}>Request a quote</a>
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
