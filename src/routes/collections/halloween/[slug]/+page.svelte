<script lang="ts">
	import { resolve } from '$app/paths';
	import ProductMedia from '$lib/components/products/ProductMedia.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const product = $derived(data.product);
	const design = $derived(data.design);
	const productPackage = $derived(data.productPackage);
	const variant = $derived(data.variant);
	const unitPrice = $derived(variant ? `$${(variant.priceCents / 100).toFixed(2)}` : '');
	const totalPrice = $derived(variant ? `$${((variant.priceCents * data.quantity) / 100).toFixed(2)}` : '');
	const requiresPersonalization = $derived(Boolean(variant && /personalized|custom/i.test(variant.id)));
</script>

<svelte:head>
	<title>{product.title} | Holographe Halloween Collection</title>
	<meta name="description" content={product.description} />
	<meta property="og:title" content={`${product.title} | Holographe`} />
	<meta property="og:description" content={product.description} />
</svelte:head>

<article class="product-page">
	<a class="back-link" href={resolve('/collections/halloween')}>← Halloween Collection</a>
	<div class="product-layout">
		<ProductMedia media={product.media} label={product.title} variant="detail" />
		<div class="product-copy">
			<div class="badge-row">
				{#each product.badges as badge (badge)}
					<span>{badge}</span>
				{/each}
			</div>
			<h1>{product.title}</h1>
			<p class="lead">{product.description}</p>
			<div class="product-notes">
				<p>A Holographe Exclusive</p>
				<p>Designed in-house to make an everyday surface feel different.</p>
				<p>Watch it come alive in the light.</p>
				<p>Limited seasonal release.</p>
			</div>
			{#if design && productPackage}
				<section class="selected-summary" aria-label="Selected Halloween mural">
					<span>Your mural</span>
					<strong>{design.name}</strong>
					<p>Format: {productPackage.editionName}</p>
					<p>Selected variant: {variant?.label ?? variant?.id ?? 'Choose an option'}</p>
					<p>Unit price: {unitPrice}</p>
					<p>Quantity: {data.quantity} · Total: {totalPrice}</p>
				</section>
				{#if productPackage.variants.length > 1}
					<fieldset class="variant-picker">
						<legend>Edition detail</legend>
						{#each productPackage.variants as option (option.id)}
							<label>
								<input
									type="radio"
									name="variant"
									value={option.id}
									checked={variant?.id === option.id}
									onchange={(event) => {
										const next = new URL(window.location.href);
										next.searchParams.set(
											'variant',
											(event.currentTarget as HTMLInputElement).value
										);
										window.location.href = next.toString();
									}}
								/>
								<span>{option.label ?? option.id}</span>
							</label>
						{/each}
					</fieldset>
				{/if}
				{#if variant && !requiresPersonalization}
					<form method="POST" action="/checkout" class="reserve-form">
						<input type="hidden" name="product" value="halloween-seasonal-release" />
						<input type="hidden" name="design_slug" value={design.slug} />
						<input type="hidden" name="package_id" value={productPackage.id} />
						<input type="hidden" name="variant_id" value={variant.id} />
						<input type="hidden" name="quantity" value={data.quantity} />
						<button type="submit" class="reserve-button">Reserve Your Edition</button>
					</form>
				{:else if variant}
					<section class="personalization-handoff" aria-label="Personalized Halloween order">
						<strong>Personalized Halloween orders need a fulfillment brief before checkout.</strong>
						<p>Contact Holographe with your design details so the required artwork, proofing, and order association can be confirmed.</p>
						<a class="reserve-button" href={`/contact?product=halloween&design=${encodeURIComponent(design.slug)}&variant=${encodeURIComponent(variant.id)}`}>Contact about this personalized edition</a>
					</section>
				{/if}
			{/if}
			<p class="availability-note">
				Your edition is reserved only after inventory is confirmed and the secure checkout session
				is created.
			</p>
		</div>
	</div>
</article>

<style>
	.product-page {
		width: min(1080px, calc(100vw - 1.1rem));
		margin: 0 auto;
		padding: clamp(2rem, 6vw, 5rem) 0 4rem;
	}

	.back-link {
		display: inline-block;
		margin-bottom: 1.5rem;
		color: var(--muted);
		font-size: 0.82rem;
		letter-spacing: 0.05em;
	}

	.product-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.8fr);
		gap: clamp(2rem, 6vw, 5rem);
		align-items: center;
	}

	.product-copy h1 {
		margin: 1rem 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(3rem, 6vw, 5.8rem);
		font-weight: 500;
		letter-spacing: -0.06em;
		line-height: 0.92;
	}

	.lead {
		margin: 0;
		color: var(--muted);
		font-size: 1.05rem;
	}

	.badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.badge-row span {
		padding: 0.33rem 0.48rem;
		border: 1px solid rgba(234, 195, 143, 0.2);
		border-radius: 999px;
		background: rgba(235, 183, 111, 0.06);
		color: #eac38f;
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.product-notes {
		display: grid;
		gap: 0.8rem;
		margin: 2rem 0;
		padding: 1.35rem 0;
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}

	.product-notes p {
		margin: 0;
		color: var(--muted);
	}

	.product-notes p:first-child {
		color: var(--text);
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.3rem;
	}

	.availability-note {
		color: #e8c08e;
		font-size: 0.9rem;
	}
	.personalization-handoff { display:grid; gap:.75rem; margin-top:1.2rem; padding:1rem; border:1px solid rgba(234,195,143,.28); border-radius:1rem; background:rgba(235,183,111,.08); }
	.personalization-handoff p { margin:0; color:var(--muted); }

	.selected-summary {
		display: grid;
		gap: 0.35rem;
		margin-top: 1.5rem;
		padding: 1.15rem;
		border: 1px solid rgba(234, 195, 143, 0.24);
		border-radius: 1rem;
		background: rgba(235, 183, 111, 0.06);
	}

	.selected-summary span {
		color: #eac38f;
		font-size: 0.65rem;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.selected-summary strong {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.55rem;
		font-weight: 500;
	}

	.selected-summary p {
		margin: 0;
		color: var(--muted);
		font-size: 0.9rem;
	}

	.variant-picker {
		display: grid;
		gap: 0.6rem;
		margin: 1.2rem 0;
		padding: 0;
		border: 0;
	}

	.variant-picker legend {
		margin-bottom: 0.35rem;
		color: var(--muted);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.variant-picker label {
		display: flex;
		gap: 0.55rem;
		align-items: center;
		color: var(--muted);
		font-size: 0.85rem;
	}

	.reserve-form {
		margin-top: 1.2rem;
	}

	.reserve-button {
		width: 100%;
		padding: 0.9rem 1rem;
		border: 1px solid rgba(234, 195, 143, 0.45);
		border-radius: 999px;
		background: rgba(235, 183, 111, 0.12);
		color: var(--text);
		font: inherit;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		cursor: pointer;
	}

	@media (max-width: 720px) {
		.product-page {
			padding-top: 1.4rem;
		}

		.product-layout {
			grid-template-columns: 1fr;
		}
	}
</style>
