<script lang="ts">
	import { resolve } from '$app/paths';
	import { track } from '@vercel/analytics/sveltekit';
	import {
		getRivalQuestSummary,
		rivalQuestAgeRanges,
		rivalQuestPartyLengths,
		rivalQuestPlayerCounts,
		rivalQuestSettings
	} from '$lib/products/rival-quest-builder';

	let { data } = $props();
	const downloadHref = $derived(
		`${resolve('/games/rival-quest/download')}?session_id=${encodeURIComponent(data.sessionId)}`
	);
	const summary = $derived(data.config ? getRivalQuestSummary(data.config) : '');

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
					your customized printable PDF.
				</p>
				{#if data.config}
					<div class="download-summary">
						<strong>{summary}</strong>
						<span>{rivalQuestSettings[data.config.setting].label}</span>
						<span>{rivalQuestAgeRanges[data.config.ageRange]}</span>
						<span>{rivalQuestPlayerCounts[data.config.playerCount]} players</span>
						<span>{rivalQuestPartyLengths[data.config.partyLength]}</span>
						{#if data.config.partyName}
							<span>{data.config.partyName}</span>
						{/if}
					</div>
				{/if}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a class="button-primary" href={downloadHref}> Download customized PDF </a>
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

	.download-summary {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.download-summary strong,
	.download-summary span {
		padding: 0.55rem 0.75rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		color: #f8f4ee;
	}

	.download-summary strong {
		width: 100%;
		border-radius: 0.85rem;
		background: rgba(244, 193, 124, 0.14);
	}

	@media (max-width: 640px) {
		.success-card .button-primary {
			width: 100%;
		}
	}
</style>
