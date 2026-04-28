<script lang="ts">
	import { resolve } from '$app/paths';
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
			<p class="eyebrow">Payment received</p>
			<h1>Your order is in.</h1>
			<p>If we still need your photo or notes, send them now.</p>
			<div class="button-row">
				<a class="button-primary" href="tel:3479960205">Call Christina</a>
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
