<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { halloweenPackages } from '$lib/products/halloween';

	let { data }: { data: PageData } = $props();
	type ProductType = 'mural' | 'decal';
	let type = $state<ProductType>('mural');
	let packageId = $state('single-panel');
	let personalized = $state(false);
	let quantity = $state(1);
	let decalSize = $state('4-inch');
	let addedMessage = $state('');
	const decalOptions = [
		{ id: '4-inch', label: '4 inch', description: 'A small pop of spooky detail.', price: 999 },
		{ id: '6-inch', label: '6 inch', description: 'A little more room for the artwork.', price: 1499 },
		{ id: '8-inch', label: '8 inch', description: 'The biggest single decal size.', price: 1999 }
	];
	const currentPackage = $derived(halloweenPackages.find((item) => item.id === packageId)!);
	const basePrice = $derived(
			type === 'decal'
				? (decalOptions.find((option) => option.id === decalSize)?.price ?? 999) + (personalized ? 500 : 0)
			: (currentPackage?.variants.find((variant) => variant.id.endsWith(personalized ? 'personalized' : 'standard'))?.priceCents ?? 1999)
	);
	const totalPrice = $derived(basePrice * (type === 'mural' ? quantity : 1));
	const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
	onMount(() => { type = data.initialType as ProductType; });
	function addToBag() {
		let items: Array<Record<string, unknown>> = [];
		try {
			items = JSON.parse(localStorage.getItem('holographe-halloween-cart') ?? '[]');
		} catch { items = []; }
		if (type === 'decal') {
			items.push({ kind: 'decal', designSlug: data.design.slug, decalSize, personalized, quantity: 1 });
		} else {
			const variantId = currentPackage.variants.find((variant) => variant.id.endsWith(personalized ? 'personalized' : 'standard'))?.id ?? currentPackage.variants[0].id;
			items.push({ kind: 'mural', designSlug: data.design.slug, packageId, variantId, quantity });
		}
		localStorage.setItem('holographe-halloween-cart', JSON.stringify(items));
		addedMessage = 'Added to your bag. Taking you back to your collection…';
		window.setTimeout(() => goto(`${resolve('/collections/halloween')}?added=1`), 450);
	}
</script>

<svelte:head>
	<title>{data.design.name} | Holographe Halloween</title>
	<meta name="description" content={`Choose a size for ${data.design.name} Halloween magnetic artwork.`} />
</svelte:head>

<main class="detail-page">
	<a class="back-link" href={resolve('/collections/halloween')}>← Back to Halloween</a>
	<ol class="steps" aria-label="Shopping steps">
		<li class="complete">1. Artwork</li><li class="current" aria-current="step">2. Size &amp; options</li><li>3. Bag &amp; checkout</li>
	</ol>
	<div class="detail-layout">
		<div class="artwork-panel">
			<img src={data.design.thumbnail?.src} alt={data.design.thumbnail?.alt ?? data.design.name} />
			<p>You picked</p><h1>{data.design.name}</h1>
		</div>
		<section class="choices" aria-labelledby="size-heading">
			<p class="eyebrow">Step 2 · make it yours</p>
			<h2 id="size-heading">Choose your size</h2>
			<div class="type-switch" aria-label="Product type">
				<button class:active={type === 'mural'} onclick={() => (type = 'mural')}>Mural magnets</button>
				<button class:active={type === 'decal'} onclick={() => (type = 'decal')}>Magnetic decals</button>
			</div>
			{#if type === 'mural'}
				<fieldset class="option-list">
					<legend>Pick a format</legend>
					{#each halloweenPackages as option (option.id)}
						<label class:chosen={packageId === option.id} class="option-card">
							<input type="radio" name="package" value={option.id} bind:group={packageId} />
							<span class="option-copy"><strong>{option.label}</strong><small>{option.description}</small></span>
							<strong class="price">{option.priceLabel}</strong>
						</label>
					{/each}
				</fieldset>
			{:else}
				<fieldset class="option-list">
					<legend>Pick a decal size</legend>
					{#each decalOptions as option (option.id)}
						<label class:chosen={decalSize === option.id} class="option-card">
							<input type="radio" name="decal-size" value={option.id} bind:group={decalSize} />
							<span class="option-copy"><strong>{option.label}</strong><small>{option.description}</small></span>
							<strong class="price">{formatPrice(option.price)}</strong>
						</label>
					{/each}
				</fieldset>
				<aside class="warning"><strong>Indoor use only for now</strong><p>Holographe decorative magnets feature a protective, UV-resistant laminate. However, the finished products have not yet been tested or certified for outdoor or vehicle use. At this time, they are intended for indoor magnetic surfaces only. Vehicle use is not recommended until additional durability and adhesion testing is completed.</p></aside>
			{/if}
			<label class="personalize"><input type="checkbox" bind:checked={personalized} /><span>Add personalization <small>+$5.00 · name or short phrase</small></span></label>
			{#if type === 'mural'}
				<label class="quantity">Quantity <input type="number" min="1" max="20" bind:value={quantity} /></label>
			{/if}
			<div class="purchase-row"><div><small>Your selection</small><strong>{formatPrice(totalPrice)}</strong></div><button class="add-button" onclick={addToBag}>Add to bag · {formatPrice(totalPrice)}</button></div>
			{#if addedMessage}<p role="status" class="status">{addedMessage}</p>{/if}
			<p class="fine-print">Shipping and any applicable tax are calculated at checkout.</p>
		</section>
	</div>
</main>

<style>
	.detail-page { width: min(1120px, calc(100vw - 2rem)); margin: auto; padding: clamp(1.5rem, 4vw, 3rem) 0 4rem; color: #fff7fb; }
	.back-link { display: inline-block; margin-bottom: 1.5rem; color: #d8c5dc; }
	.steps { display: flex; gap: .75rem; list-style: none; padding: 0 0 1.2rem; margin: 0 0 2rem; border-bottom: 1px solid rgba(255,255,255,.12); color: #b7a8b9; font-size: .82rem; }
	.steps li { padding-right: .75rem; }.steps .complete { color: #eac38f; }.steps .current { color: #fff7fb; font-weight: 700; }
	.detail-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(20rem, .9fr); gap: clamp(2rem, 6vw, 5rem); align-items: start; }
	.artwork-panel { position: sticky; top: 1.5rem; }.artwork-panel img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 1.25rem; border: 1px solid rgba(255,255,255,.14); }.artwork-panel p { margin: 1rem 0 .3rem; color: #eac38f; font-size: .7rem; letter-spacing: .12em; text-transform: uppercase; }.artwork-panel h1 { margin: 0; font: 500 clamp(2rem, 4vw, 3rem)/1.05 Georgia,serif; }
	.eyebrow { color: #eac38f; font-size: .7rem; letter-spacing: .13em; text-transform: uppercase; }.choices h2 { margin: .5rem 0 1.25rem; font: 500 clamp(2rem, 4vw, 3rem)/1.05 Georgia,serif; }
	.type-switch { display: grid; grid-template-columns: 1fr 1fr; padding: .3rem; margin-bottom: 1.4rem; border: 1px solid rgba(236,185,108,.2); border-radius: 999px; background: #100b10; }.type-switch button { padding: .75rem .5rem; border: 0; border-radius: 999px; background: transparent; color: #d8c5dc; font: inherit; cursor: pointer; }.type-switch button.active { background: #f0bf75; color: #21120d; font-weight: 700; }
	.option-list { display: grid; gap: .65rem; margin: 0; padding: 0; border: 0; }.option-list legend { margin-bottom: .55rem; color: #d8c5dc; font-size: .82rem; }.option-card { display: flex; align-items: center; gap: .75rem; padding: .9rem; border: 1px solid rgba(255,255,255,.13); border-radius: .8rem; background: #100d12; cursor: pointer; }.option-card.chosen { border-color: #f0bf75; background: rgba(240,191,117,.08); }.option-card input,.personalize input { accent-color: #f0bf75; }.option-copy { display: grid; gap: .25rem; flex: 1; }.option-copy small,.personalize small { color: #c7b9ca; font-size: .78rem; line-height: 1.4; }.price { color: #f0bf75; white-space: nowrap; }
	.warning { margin: 1rem 0; padding: 1rem; border: 1px solid rgba(240,191,117,.35); border-left: 3px solid #f0bf75; border-radius: .7rem; background: rgba(240,191,117,.07); }.warning strong { color: #f0bf75; }.warning p { margin: .45rem 0 0; color: #f2e6d2; font-size: .8rem; line-height: 1.55; }
	.personalize { display: flex; gap: .7rem; align-items: flex-start; margin: 1.1rem 0; }.personalize span { display: grid; gap: .25rem; }.quantity { display: flex; align-items: center; justify-content: space-between; margin: 1rem 0; color: #d8c5dc; }.quantity input { width: 5rem; padding: .55rem; border: 1px solid rgba(255,255,255,.2); border-radius: .5rem; background: #100d12; color: white; }
	.purchase-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255,255,255,.12); }.purchase-row div { display: grid; gap: .25rem; }.purchase-row small,.fine-print { color: #b7a8b9; }.purchase-row strong { font: 500 1.8rem Georgia,serif; color: #f0bf75; }.add-button { padding: .9rem 1.3rem; border: 1px solid rgba(234,195,143,.5); border-radius: 999px; background: #f0bf75; color: #21120d; font-weight: 700; cursor: pointer; }.fine-print { font-size: .78rem; }.status { color: #f0bf75; }
	@media (max-width: 760px) { .detail-layout { grid-template-columns: 1fr; }.artwork-panel { position: static; }.artwork-panel img { max-height: 70vh; }.steps { gap: .35rem; font-size: .72rem; }.steps li { padding-right: .3rem; }.purchase-row { align-items: stretch; flex-direction: column; }.add-button { width: 100%; } }
</style>
