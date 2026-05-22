<script lang="ts">
	import { resolve } from '$app/paths';
	import { addOns, packageTiers } from '$lib/pricing';

	const primaryTiers = packageTiers.slice(0, 4);
	const palette = ['warm', 'cool', 'rose', 'ice'] as const;

	let activeTierId = $state<string | null>(null);
	let selectedSizes = $state<Record<string, string>>(
		Object.fromEntries(
			primaryTiers.map((tier) => [tier.id, tier.sizeOptions[0] ?? tier.primarySize])
		)
	);

	const activeTier = $derived(primaryTiers.find((tier) => tier.id === activeTierId) ?? null);
	const activePalette = $derived(
		activeTier
			? (palette[primaryTiers.findIndex((tier) => tier.id === activeTier.id)] ?? 'warm')
			: 'warm'
	);

	function openTier(id: string) {
		activeTierId = id;
	}

	function closeTier() {
		activeTierId = null;
	}

	function packageLink(tier?: (typeof primaryTiers)[number], size?: string) {
		if (!tier) return resolve('/contact');
		if (tier.studioFlow === 'custom-order') {
			const params = new URLSearchParams({
				package: tier.name,
				size: size ?? tier.primarySize
			});
			return `${resolve('/contact')}?${params.toString()}`;
		}

		const quantity = tier.checkoutQuantity;
		if (!quantity) return resolve('/contact');
		const params = new URLSearchParams({ order: '1', package: String(quantity) });
		if (size) params.set('size', size);
		return `${resolve('/')}?${params.toString()}#preview-builder`;
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && activeTierId) closeTier();
	}
</script>

<svelte:head>
	<title>Pricing | Holograph</title>
	<meta
		name="description"
		content="Choose a Holograph package, open it like a premium selection screen, and start your order."
	/>
</svelte:head>

<svelte:window onkeydown={handleWindowKeydown} />

<section class="section pricing-page">
	<div class="pricing-stage">
		<section class="pricing-hero glass-card">
			<p class="eyebrow">Selection Screen</p>
			<h1>Choose your set.</h1>
			<p>Open a tier. Pick a size. Start your order.</p>
		</section>

		<section class="selection-grid" aria-label="Package selection">
			{#each primaryTiers as tier, index (tier.id)}
				<button
					type="button"
					class={`selection-card glass-card ${palette[index]}`}
					onclick={() => openTier(tier.id)}
				>
					<span class="selection-frame"></span>
					<span class="selection-aura"></span>
					<span class="selection-scan"></span>
					<span class="selection-orb">
						<span class="orb-ring"></span>
						<span class="orb-core"></span>
					</span>
					<p class="selection-tier">Tier {index + 1}</p>
					<h2>{tier.name}</h2>
					<p class="selection-price">{tier.priceLabel}</p>
					<p class="selection-meta">{tier.quantityLabel}</p>
					<div class="selection-bars" aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
					</div>
					<div class="selection-pips" aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
					</div>
					{#if tier.badge}
						<span class="selection-badge">{tier.badge}</span>
					{/if}
				</button>
			{/each}
		</section>

		<section class="mini-band glass-card">
			<p class="eyebrow">Extras</p>
			<div class="extras-inline">
				{#each addOns as item}
					<span>{item.name} · {item.priceLabel}</span>
				{/each}
			</div>
		</section>
	</div>

	{#if activeTier}
		<div class="selection-modal-shell">
			<button
				type="button"
				class="selection-modal-backdrop"
				aria-label="Close package window"
				onclick={closeTier}
			></button>
			<div
				class={`selection-modal glass-card ${activePalette}`}
				role="dialog"
				aria-modal="true"
				aria-label={activeTier.name}
			>
				<span class="modal-halo modal-halo-a" aria-hidden="true"></span>
				<span class="modal-halo modal-halo-b" aria-hidden="true"></span>
				<span class="modal-grid" aria-hidden="true"></span>
				<button
					type="button"
					class="selection-close"
					aria-label="Close package window"
					onclick={closeTier}
				>
					Close
				</button>

				<div class="selection-modal-top">
					<div class="selection-emblem" aria-hidden="true">
						<span class="orb-ring"></span>
						<span class="orb-core"></span>
					</div>
					<p class="eyebrow">Package Selected</p>
					<div class="modal-powerbar" aria-hidden="true">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<h2>{activeTier.name}</h2>
					<p class="modal-price">{activeTier.priceLabel}</p>
					<p class="modal-copy">{activeTier.description}</p>
				</div>

				<div class="modal-panel">
					<p class="panel-label">Choose a size</p>
					<div class="size-grid">
						{#each activeTier.sizeOptions as option}
							<button
								type="button"
								class:selected-size={selectedSizes[activeTier.id] === option}
								class="size-chip"
								onclick={() => (selectedSizes[activeTier.id] = option)}
							>
								{option}
							</button>
						{/each}
					</div>
				</div>

				<div class="modal-panel">
					<p class="panel-label">What’s included</p>
					<div class="loot-grid">
						{#each activeTier.included as item}
							<div class="loot-card">
								<span class="loot-dot"></span>
								<p>{item}</p>
							</div>
						{/each}
					</div>
				</div>

				<div class="modal-stats">
					<span>{activeTier.quantityLabel}</span>
					<span>{selectedSizes[activeTier.id]}</span>
					<span>{activeTier.perceivedValue}</span>
				</div>

				<a
					class="button-primary modal-cta"
					href={packageLink(activeTier, selectedSizes[activeTier.id])}
				>
					{activeTier.studioFlow === 'custom-order' ? 'Request Custom Order' : 'Start Order'}
				</a>
			</div>
		</div>
	{/if}
</section>

<style>
	h1,
	h2,
	p {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Cormorant Garamond', 'Georgia', 'Iowan Old Style', serif;
		font-weight: 500;
		letter-spacing: -0.04em;
		color: #f8f4ee;
	}

	h1 {
		font-size: clamp(2rem, 4vw, 2.7rem);
		line-height: 0.96;
	}

	h2 {
		font-size: clamp(1.35rem, 2vw, 1.9rem);
		line-height: 1.04;
	}

	p {
		line-height: 1.6;
		color: rgba(238, 231, 221, 0.76);
	}

	.pricing-page {
		display: block;
	}

	.pricing-stage {
		width: var(--frame-rail);
		margin: 0 auto;
		display: grid;
		justify-items: center;
		align-items: start;
		gap: 1rem;
	}

	.pricing-hero,
	.mini-band {
		width: min(100%, 44rem);
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 0.55rem;
		padding: 1.1rem;
	}

	.selection-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: stretch;
		gap: 0.9rem;
		width: min(100%, 54rem);
		margin: 0 auto;
	}

	.selection-card {
		position: relative;
		display: grid;
		justify-items: center;
		align-content: start;
		gap: 0.45rem;
		flex: 0 1 16.5rem;
		max-width: 16.5rem;
		width: 100%;
		padding: 1rem 0.9rem 1.1rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		cursor: pointer;
		overflow: hidden;
		transition:
			transform 180ms ease,
			border-color 180ms ease,
			box-shadow 180ms ease,
			filter 180ms ease;
	}

	.selection-card:hover {
		transform: translateY(-4px) scale(1.015);
		border-color: rgba(255, 255, 255, 0.18);
		box-shadow:
			0 26px 54px rgba(0, 0, 0, 0.32),
			0 0 40px rgba(255, 228, 196, 0.08);
		filter: saturate(1.08);
	}

	.selection-frame,
	.selection-scan {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.selection-aura {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(circle at top center, rgba(255, 255, 255, 0.1), transparent 34%);
	}

	.selection-frame {
		inset: 0.35rem;
		border-radius: 1.35rem;
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.02),
			0 0 18px rgba(255, 255, 255, 0.03);
	}

	.selection-scan {
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgba(255, 255, 255, 0.05) 20%,
			transparent 40%,
			transparent 100%
		);
		opacity: 0.8;
		mix-blend-mode: screen;
	}

	.selection-orb,
	.selection-emblem {
		position: relative;
		display: grid;
		place-items: center;
		width: 4.4rem;
		height: 4.4rem;
		border-radius: 999px;
		background: radial-gradient(
			circle,
			rgba(255, 255, 255, 0.12),
			rgba(255, 255, 255, 0.02) 58%,
			transparent 70%
		);
	}

	.orb-ring,
	.orb-core {
		position: absolute;
		border-radius: 999px;
	}

	.orb-ring {
		inset: 0.52rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow:
			0 0 20px rgba(255, 228, 196, 0.14),
			inset 0 0 12px rgba(255, 255, 255, 0.06);
	}

	.orb-core {
		width: 0.85rem;
		height: 0.85rem;
		background: linear-gradient(135deg, #ffe3bc, #d7e6ff);
		box-shadow: 0 0 18px rgba(255, 227, 187, 0.42);
	}

	.selection-tier,
	.panel-label {
		font-size: 0.64rem;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(215, 225, 241, 0.64);
	}

	.selection-price,
	.modal-price {
		font-family: 'Cormorant Garamond', 'Georgia', 'Iowan Old Style', serif;
		font-size: 2rem;
		line-height: 0.9;
		color: #fff7ec;
	}

	.selection-meta {
		font-size: 0.82rem;
		color: rgba(238, 231, 221, 0.66);
	}

	.selection-bars {
		display: inline-flex;
		align-items: end;
		justify-content: center;
		gap: 0.24rem;
		padding-top: 0.15rem;
	}

	.selection-bars span {
		display: block;
		width: 0.42rem;
		border-radius: 999px;
		background: linear-gradient(180deg, rgba(255, 230, 193, 0.95), rgba(209, 226, 255, 0.58));
		box-shadow: 0 0 14px rgba(255, 228, 190, 0.16);
	}

	.selection-bars span:nth-child(1) {
		height: 0.55rem;
		opacity: 0.55;
	}
	.selection-bars span:nth-child(2) {
		height: 0.82rem;
		opacity: 0.8;
	}
	.selection-bars span:nth-child(3) {
		height: 1.08rem;
	}

	.selection-pips {
		display: inline-flex;
		gap: 0.34rem;
	}

	.selection-pips span {
		width: 0.38rem;
		height: 0.38rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.16);
		box-shadow: 0 0 12px rgba(255, 233, 201, 0.18);
	}

	.selection-pips span:nth-child(2) {
		background: linear-gradient(135deg, rgba(255, 231, 196, 0.9), rgba(214, 228, 255, 0.92));
	}

	.selection-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.36rem 0.62rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(244, 238, 228, 0.82);
	}

	.warm {
		background:
			linear-gradient(180deg, rgba(38, 22, 10, 0.42), rgba(10, 10, 10, 0.22)),
			radial-gradient(circle at top left, rgba(255, 214, 168, 0.14), transparent 38%);
	}
	.cool {
		background:
			linear-gradient(180deg, rgba(16, 24, 40, 0.44), rgba(10, 10, 10, 0.22)),
			radial-gradient(circle at top right, rgba(176, 214, 255, 0.14), transparent 38%);
	}
	.rose {
		background:
			linear-gradient(180deg, rgba(38, 18, 28, 0.42), rgba(10, 10, 10, 0.22)),
			radial-gradient(circle at bottom left, rgba(255, 189, 219, 0.14), transparent 38%);
	}
	.ice {
		background:
			linear-gradient(180deg, rgba(16, 22, 32, 0.42), rgba(10, 10, 10, 0.22)),
			radial-gradient(circle at bottom right, rgba(189, 225, 255, 0.14), transparent 38%);
	}

	.extras-inline {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.45rem;
	}

	.extras-inline span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.42rem 0.66rem;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		font-size: 0.7rem;
		color: rgba(243, 236, 227, 0.7);
	}

	.selection-modal-shell {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: grid;
		place-items: center;
		padding: 0.8rem;
	}

	.selection-modal-backdrop {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgba(4, 5, 8, 0.76);
		backdrop-filter: blur(16px);
	}

	.selection-modal {
		position: relative;
		z-index: 1;
		width: min(560px, calc(100vw - 1rem));
		display: grid;
		gap: 0.9rem;
		padding: 1.1rem;
		text-align: center;
		justify-items: center;
		overflow: hidden;
		box-shadow:
			0 34px 90px rgba(0, 0, 0, 0.48),
			0 0 60px rgba(255, 229, 196, 0.1);
		animation: modal-rise 220ms ease-out;
	}

	.selection-close {
		position: absolute;
		top: 0.9rem;
		right: 0.9rem;
		z-index: 3;
		padding: 0.42rem 0.64rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		color: rgba(248, 244, 238, 0.72);
		font-size: 0.76rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.selection-close:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.modal-halo,
	.modal-grid {
		position: absolute;
		pointer-events: none;
	}

	.modal-halo {
		width: 13rem;
		height: 13rem;
		border-radius: 999px;
		filter: blur(24px);
		opacity: 0.34;
	}

	.modal-halo-a {
		top: -3rem;
		left: -2rem;
		background: radial-gradient(circle, rgba(255, 213, 168, 0.52), transparent 64%);
	}

	.modal-halo-b {
		right: -2.5rem;
		bottom: -3rem;
		background: radial-gradient(circle, rgba(187, 219, 255, 0.42), transparent 64%);
	}

	.modal-grid {
		inset: 0;
		opacity: 0.2;
		background-image:
			linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
		background-size: 28px 28px;
		mask-image: radial-gradient(circle at center, black 26%, transparent 92%);
	}

	.selection-modal-top,
	.modal-panel {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 0.7rem;
		width: 100%;
		justify-items: center;
	}

	.selection-modal-top {
		padding-top: 0.55rem;
	}

	.modal-powerbar {
		display: inline-grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.34rem;
		width: min(11rem, 100%);
	}

	.modal-powerbar span {
		display: block;
		height: 0.34rem;
		border-radius: 999px;
		background: linear-gradient(90deg, rgba(255, 229, 196, 0.9), rgba(213, 230, 255, 0.9));
		box-shadow: 0 0 16px rgba(255, 228, 196, 0.18);
	}

	.modal-powerbar span:nth-child(1) {
		opacity: 0.45;
	}

	.modal-powerbar span:nth-child(2) {
		opacity: 0.7;
	}

	.modal-powerbar span:nth-child(3) {
		opacity: 0.88;
	}

	.modal-copy {
		max-width: 30rem;
	}

	.size-grid,
	.modal-stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.55rem;
		width: 100%;
	}

	.size-chip,
	.modal-stats span {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.62rem 0.92rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		color: #f6f1ea;
	}

	.size-chip {
		cursor: pointer;
		transition:
			transform 160ms ease,
			border-color 160ms ease,
			background 160ms ease;
	}

	.size-chip:hover,
	.selected-size {
		transform: translateY(-1px);
		border-color: rgba(255, 236, 214, 0.24);
		background:
			radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 54%),
			linear-gradient(135deg, rgba(255, 239, 214, 0.22), rgba(215, 227, 255, 0.16));
		box-shadow:
			0 0 22px rgba(255, 230, 196, 0.14),
			inset 0 1px 0 rgba(255, 255, 255, 0.12);
	}

	.loot-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.55rem;
		width: 100%;
	}

	.loot-card {
		display: grid;
		justify-items: center;
		gap: 0.35rem;
		padding: 0.72rem;
		border-radius: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
	}

	.loot-dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: linear-gradient(135deg, #ffe0b5, #d7e6ff);
		box-shadow: 0 0 14px rgba(255, 232, 204, 0.24);
	}

	.modal-cta {
		position: relative;
		z-index: 1;
		width: min(100%, 18rem);
		min-height: 3.3rem;
		font-size: 1.02rem;
		box-shadow:
			0 22px 56px rgba(242, 198, 154, 0.28),
			0 0 28px rgba(215, 227, 255, 0.14);
	}

	.modal-cta:hover {
		transform: translateY(-2px) scale(1.015);
	}

	@keyframes modal-rise {
		from {
			opacity: 0;
			transform: translateY(16px) scale(0.98);
		}

		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@media (max-width: 640px) {
		.loot-grid {
			grid-template-columns: 1fr;
		}

		.pricing-hero,
		.mini-band,
		.selection-card,
		.selection-modal {
			padding: 0.95rem;
		}

		.selection-grid {
			width: 100%;
		}

		.selection-card {
			flex-basis: 100%;
			max-width: 100%;
		}

		.selection-modal {
			width: min(100%, calc(100vw - 0.8rem));
		}
	}

	@media (max-width: 860px) and (min-width: 641px) {
		.selection-card {
			flex-basis: calc(50% - 0.45rem);
			max-width: calc(50% - 0.45rem);
		}
	}
</style>
