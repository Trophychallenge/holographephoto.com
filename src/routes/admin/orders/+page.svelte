<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let recoveryStatus = $state('');
	let recoveryPending = $state(false);

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

	async function recoverOctoberOrder() {
		if (!data.recovery || recoveryPending) return;
		if (!window.confirm('Create the private paid-order record and send one “Recovered paid order” alert? This cannot charge, refund, or replay Stripe.')) return;

		recoveryPending = true;
		recoveryStatus = '';
		try {
			const response = await fetch('/admin/orders/backfill', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ sessionId: data.recovery.sessionId })
			});
			const result = (await response.json()) as { stored?: boolean; notification?: string; error?: string };
			if (!response.ok) throw new Error(result.error || 'Recovery did not complete.');
			recoveryStatus = result.stored
				? result.notification === 'sent'
					? 'Recovered private order record and sent the single recovery alert. Refreshing the order list…'
					: 'Recovered private order record. The recovery alert needs attention. Refreshing the order list…'
				: 'This paid session was already recovered; no duplicate alert was sent.';
			setTimeout(() => window.location.reload(), 900);
		} catch (error) {
			recoveryStatus = error instanceof Error ? error.message : 'Recovery did not complete.';
			recoveryPending = false;
		}
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

		<section class="glass-card recovery-card" aria-labelledby="recovery-heading">
			<div>
				<p class="eyebrow">One-time recovery</p>
				<h2 id="recovery-heading">October 5 paid order</h2>
				<p>Review Stripe’s canonical paid-session summary before creating its private record.</p>
			</div>
			{#if data.recovery}
				<div class="recovery-summary">
					<span>{data.recovery.offer}</span>
					<span>{data.recovery.quantity} item{data.recovery.quantity === '1' ? '' : 's'} · {formatMoney(data.recovery.amountTotal, data.recovery.currency)}</span>
					<span>{data.recovery.paymentStatus || 'unknown payment'} · {data.recovery.status || 'unknown status'}</span>
					<span>{data.recovery.hasOriginalPhoto ? 'Original photo available' : 'Original photo reference missing'}</span>
					<span>{data.recovery.hasOverlay ? 'Overlay attached' : 'No overlay captured'}</span>
				</div>
				<button type="button" onclick={recoverOctoberOrder} disabled={recoveryPending}>
					{recoveryPending ? 'Recovering…' : 'Recover paid order'}
				</button>
			{:else}
				<p>{data.recoveryError || 'Recovery preview is unavailable.'}</p>
			{/if}
			{#if recoveryStatus}<p class="recovery-status" aria-live="polite">{recoveryStatus}</p>{/if}
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
								{#if order.metadata.base_blob_pathname}
									<a href={`/admin/orders/file?session_id=${encodeURIComponent(order.sessionId)}&kind=base`}>Download original photo</a>
								{/if}
								{#if order.metadata.overlay_blob_pathname}
									<a href={`/admin/orders/file?session_id=${encodeURIComponent(order.sessionId)}&kind=overlay`}>Download overlay file</a>
								{/if}
								<a href={`/admin/orders/file?session_id=${encodeURIComponent(order.sessionId)}&kind=record`}>Download private order JSON</a>
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
		color: #2a1035;
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
		color: #4b3651;
		line-height: 1.55;
	}

	a {
		color: #5d158d;
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 0.16em;
	}

	a:hover {
		color: #3e075f;
		background: #f5e7ff;
	}

	a:focus-visible {
		outline: 3px solid #087d97;
		outline-offset: 3px;
		border-radius: 0.25rem;
	}

	.orders-wrap {
		display: grid;
		gap: 1rem;
	}

	.orders-hero,
	.order-card,
	.empty-card,
	.recovery-card {
		padding: 1.1rem;
	}

	.orders-hero {
		display: grid;
		gap: 1rem;
	}

	.recovery-card {
		display: grid;
		gap: 0.8rem;
	}

	.recovery-summary {
		display: grid;
		gap: 0.35rem;
		padding: 0.85rem;
		border: 1px solid #b882ce;
		border-radius: 0.85rem;
		background: #fffafd;
		color: #32153e;
		font-weight: 600;
	}

	button {
		justify-self: start;
		min-height: 2.75rem;
		padding: 0.65rem 1rem;
		border: 0;
		border-radius: 999px;
		background: #7828c7;
		color: #fffaff;
		font: inherit;
		font-weight: 750;
		cursor: pointer;
	}

	button:hover:not(:disabled) { background: #5d158d; }
	button:disabled { cursor: wait; opacity: 0.65; }
	button:focus-visible { outline: 3px solid #087d97; outline-offset: 3px; }
	.recovery-status { color: #32153e; font-weight: 650; }

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
		border: 1px solid #d6b9df;
		background: #fffafd;
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
		color: #593660;
	}

	.hero-stat strong {
		font-size: 1rem;
		font-weight: 600;
		color: #2a1035;
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
		color: #2a1035;
	}

	.order-total small,
	.subcopy {
		color: #5d4664;
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
		border: 1px solid #bd8dce;
		background: #f9edff;
		color: #4a0f70;
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
		color: #2a1035;
	}

	.line-item small {
		color: #5d4664;
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
