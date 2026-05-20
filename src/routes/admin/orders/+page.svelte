<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	function formatMoney(amount: number | null | undefined, currency: string | null | undefined) {
		if (amount == null || !currency) return 'Pending';

		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency.toUpperCase()
		}).format(amount / 100);
	}

	function formatDate(value: string) {
		return dateFormatter.format(new Date(value));
	}

	function shippingAddress(address: {
		line1?: string | null;
		line2?: string | null;
		city?: string | null;
		state?: string | null;
		postal_code?: string | null;
		country?: string | null;
	} | null | undefined) {
		if (!address) return '';

		return [address.line1, address.line2, [address.city, address.state].filter(Boolean).join(', '), address.postal_code, address.country]
			.filter(Boolean)
			.join(' · ');
	}
</script>

<svelte:head>
	<title>Admin Orders | Holograph</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="section orders-page">
	<div class="page-wrap orders-wrap">
		<section class="glass-card orders-hero">
			<div class="orders-copy">
				<p class="eyebrow">Admin orders</p>
				<h1>Recent paid orders and production files.</h1>
				<p>Open the original upload, overlay, or stored JSON record from one place.</p>
			</div>
			<div class="hero-stats">
				<div class="hero-stat">
					<span>Showing</span>
					<strong>{data.orders.length}</strong>
				</div>
				<div class="hero-stat">
					<span>Source</span>
					<strong>Vercel Blob</strong>
				</div>
			</div>
		</section>

		{#if data.loadError}
			<section class="glass-card empty-card">
				<h2>Orders are temporarily unavailable.</h2>
				<p>{data.loadError}</p>
			</section>
		{/if}

		{#if data.orders.length === 0}
			<section class="glass-card empty-card">
				<h2>No paid orders yet.</h2>
				<p>
					{data.loadError
						? 'The order feed could not be loaded.'
						: 'Completed Stripe orders will appear here after the webhook stores them.'}
				</p>
			</section>
		{:else}
			<div class="orders-grid">
				{#each data.orders as order (order.sessionId)}
					<article class="glass-card order-card">
						<div class="order-top">
							<div>
								<p class="kicker">Order</p>
								<h2>{order.customerDetails?.name || order.shippingDetails?.name || 'Customer'}</h2>
								<p class="subcopy">{order.sessionId}</p>
							</div>
							<div class="order-total">
								<span>{formatMoney(order.amountTotal, order.currency)}</span>
								<small>{formatDate(order.storedAt)}</small>
							</div>
						</div>

						<div class="chip-row" aria-label="Order status">
							<span>{order.paymentStatus || 'unknown payment'}</span>
							<span>{order.status || 'unknown status'}</span>
							<span>{order.metadata.offer || `${order.metadata.quantity || '1'} item`}</span>
						</div>

						<div class="info-grid">
							<div>
								<p class="label">Contact</p>
								<p>{order.customerDetails?.email || 'No email captured'}</p>
								<p>{order.customerDetails?.phone || 'No phone captured'}</p>
							</div>
							<div>
								<p class="label">Shipping</p>
								<p>{order.shippingDetails?.name || 'No shipping name'}</p>
								<p>{shippingAddress(order.shippingDetails?.address) || 'No shipping address captured'}</p>
							</div>
						</div>

						<div class="assets-block">
							<p class="label">Production files</p>
							<div class="asset-links">
								{#if order.metadata.base_blob_url}
									<a href={order.metadata.base_blob_url} target="_blank" rel="noreferrer">Original photo</a>
								{/if}
								{#if order.metadata.overlay_blob_url}
									<a href={order.metadata.overlay_blob_url} target="_blank" rel="noreferrer">Overlay file</a>
								{/if}
								<a href={order.recordUrl} target="_blank" rel="noreferrer">Order JSON</a>
							</div>
						</div>

						{#if order.metadata.personal_request || order.metadata.gift_message}
							<div class="notes-block">
								<p class="label">Notes</p>
								{#if order.metadata.personal_request}
									<p>{order.metadata.personal_request}</p>
								{/if}
								{#if order.metadata.gift_message}
									<p>{order.metadata.gift_message}</p>
								{/if}
							</div>
						{/if}

						{#if order.lineItems.length > 0}
							<div class="line-items">
								<p class="label">Checkout</p>
								{#each order.lineItems as item}
									<div class="line-item">
										<span>{item.description || 'Custom Holograph order'}</span>
										<small>{item.quantity || 1} x {formatMoney(item.amount_total, item.currency)}</small>
									</div>
								{/each}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	h1,
	h2,
	p,
	strong {
		margin: 0;
	}

	h1,
	h2 {
		font-family: 'Georgia', 'Iowan Old Style', serif;
		letter-spacing: -0.05em;
		color: #faf7f1;
	}

	h1 {
		font-size: clamp(1.9rem, 5vw, 3rem);
		line-height: 0.96;
		font-weight: 500;
		text-wrap: balance;
	}

	h2 {
		font-size: 1.25rem;
		line-height: 1.02;
		font-weight: 500;
	}

	p {
		color: var(--muted);
		line-height: 1.55;
	}

	a {
		color: #f4e9d8;
	}

	.orders-wrap {
		display: grid;
		gap: 1rem;
	}

	.orders-hero,
	.order-card,
	.empty-card {
		padding: 1.1rem;
	}

	.orders-hero {
		display: grid;
		gap: 1rem;
	}

	.orders-copy {
		display: grid;
		gap: 0.55rem;
		max-width: 36rem;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.hero-stat,
	.line-item,
	.order-total {
		border-radius: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.035);
	}

	.hero-stat {
		display: grid;
		gap: 0.2rem;
		padding: 0.9rem;
	}

	.hero-stat span,
	.label,
	.kicker {
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(237, 226, 213, 0.58);
	}

	.hero-stat strong {
		font-size: 1rem;
		font-weight: 600;
		color: #faf7f1;
	}

	.orders-grid {
		display: grid;
		gap: 1rem;
	}

	.order-card {
		display: grid;
		gap: 1rem;
	}

	.order-top,
	.info-grid {
		display: grid;
		gap: 0.85rem;
	}

	.order-total {
		display: grid;
		gap: 0.2rem;
		padding: 0.85rem;
	}

	.order-total span {
		font-size: 1rem;
		font-weight: 600;
		color: #faf7f1;
	}

	.order-total small,
	.subcopy {
		color: rgba(244, 236, 226, 0.62);
	}

	.chip-row,
	.asset-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.chip-row span,
	.asset-links a {
		padding: 0.42rem 0.7rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		font-size: 0.76rem;
	}

	.info-grid,
	.assets-block,
	.notes-block,
	.line-items {
		display: grid;
		gap: 0.45rem;
	}

	.line-items {
		gap: 0.55rem;
	}

	.line-item {
		display: grid;
		gap: 0.18rem;
		padding: 0.8rem;
	}

	.line-item span {
		color: #faf7f1;
	}

	.line-item small {
		color: rgba(244, 236, 226, 0.62);
	}

	@media (min-width: 720px) {
		.orders-hero {
			grid-template-columns: minmax(0, 1.6fr) minmax(0, 0.8fr);
			align-items: end;
		}

		.orders-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.order-top {
			grid-template-columns: minmax(0, 1fr) auto;
			align-items: start;
		}

		.info-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
