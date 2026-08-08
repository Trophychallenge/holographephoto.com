<script lang="ts">
	import { resolve } from '$app/paths';
	import { track } from '@vercel/analytics/sveltekit';

	let { data } = $props();
	const downloadHref = $derived(
		`${resolve('/games/rival-quest/download')}?session_id=${encodeURIComponent(data.sessionId)}`
	);

	$effect(() => {
		if (data.verified) {
			track('Rival Quest Checkout Success', {
				product: data.product.metadataProduct,
				value: data.product.priceCents / 100
			});
		}
	});
</script>

<svelte:head>
	<title>Rival Quest Download | Holograph</title>
	<meta
		name="description"
		content="Download your verified Rival Quest printable party game purchase."
	/>
</svelte:head>

<section class="section success-page">
	<div class="success-wrap">
		<div class="glass-card success-card">
			<p class="eyebrow">{data.verified ? 'Payment verified' : 'Download help'}</p>

			{#if data.verified}
				<h1>Your Rival Quest download is ready.</h1>
				<p>
					We verified your Stripe payment for {data.customerEmail}. Use the button below to download
					the original ZIP file.
				</p>

				<a class="button-primary" href={downloadHref}>
					Download {data.product.downloadFilename}
				</a>
			{:else}
				<h1>We could not verify this download yet.</h1>
				<p>{data.message}</p>
				<p>
					If you completed checkout, email admin@holographephoto.com with your Stripe receipt email
					and this session reference: {data.sessionId || 'not available'}.
				</p>
				<div class="button-row">
					<a class="button-primary" href={resolve('/games/rival-quest')}>Return to Rival Quest</a>
					<a class="button-secondary" href="mailto:admin@holographephoto.com">Email support</a>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	h1,
	p {
		margin: 0;
	}

	h1 {
		font-family: 'Cormorant Garamond', 'Georgia', 'Iowan Old Style', serif;
		font-size: clamp(2.2rem, 5vw, 3.8rem);
		font-weight: 500;
		letter-spacing: -0.04em;
		line-height: 0.96;
		color: #f8f4ee;
		text-wrap: balance;
	}

	p {
		color: rgba(238, 231, 221, 0.78);
		line-height: 1.65;
	}

	.success-wrap {
		width: min(48rem, calc(100vw - 1.25rem));
		margin: 0 auto;
	}

	.success-card {
		display: grid;
		gap: 1rem;
		padding: clamp(1.1rem, 3vw, 1.8rem);
	}

	.success-card .button-primary {
		width: fit-content;
	}

	@media (max-width: 640px) {
		.success-card .button-primary {
			width: 100%;
		}
	}
</style>
