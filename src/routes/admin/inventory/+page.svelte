<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const capacity = $derived(data.dashboard.capacity);
	const availableCapacity = $derived(
		capacity ? capacity.total_units - capacity.reserved_units - capacity.consumed_units : null
	);
</script>

<svelte:head>
	<title>Halloween Edition Inventory | Holographe Admin</title>
</svelte:head>

<div class="admin-page">
	<p class="eyebrow">Holographe Admin</p>
	<h1>Halloween Edition Inventory</h1>
	{#if form?.error}<p class="message error">{form.error}</p>{/if}
	{#if form?.success}<p class="message success">{form.success}</p>{/if}
	{#if data.loadError}
		<p class="message error">{data.loadError}</p>
	{:else if capacity}
		<section class="capacity-card">
			<div><span>Total production capacity</span><strong>{capacity.total_units}</strong></div>
			<div><span>Available capacity</span><strong>{availableCapacity}</strong></div>
			<div><span>Reserved capacity</span><strong>{capacity.reserved_units}</strong></div>
			<div><span>Consumed capacity</span><strong>{capacity.consumed_units}</strong></div>
			<form method="POST" action="?/capacity" class="capacity-form">
				<label
					>Total capacity <input
						name="total_units"
						type="number"
						min="0"
						value={capacity.total_units}
					/></label
				>
				<label
					>Release status
					<select name="enabled" value={String(capacity.enabled)}>
						<option value="true">Orders enabled</option><option value="false">Orders paused</option>
					</select>
				</label>
				<button type="submit">Save capacity settings</button>
			</form>
		</section>

		<section class="variants">
			<h2>SKU controls</h2>
			{#each data.dashboard.variants as variant (variant.sku)}
				<form method="POST" action="?/variant" class="variant-row">
					<div><strong>{variant.design_slug}</strong><span>{variant.variant_id}</span></div>
					<label
						>Internal quantity <input
							name="inventory_quantity"
							type="number"
							min="0"
							value={variant.inventory_quantity}
						/></label
					>
					<span>Reserved {variant.inventory_reserved}</span><span
						>Consumed {variant.inventory_consumed}</span
					>
					<label
						><select name="enabled" value={String(variant.inventory_enabled)}
							><option value="true">Enabled</option><option value="false">Disabled</option></select
						></label
					>
					<input type="hidden" name="sku" value={variant.sku} /><button type="submit">Save</button>
				</form>
			{/each}
		</section>
	{/if}
</div>

<style>
	.admin-page {
		width: min(1180px, calc(100vw - 2rem));
		margin: 0 auto;
		padding: 3rem 0 5rem;
	}
	h1,
	h2 {
		font-family: Georgia, serif;
		font-weight: 500;
	}
	h1 {
		font-size: clamp(2.5rem, 6vw, 5rem);
		margin: 0.75rem 0 2rem;
	}
	h2 {
		font-size: 2rem;
	}
	.capacity-card,
	.variants {
		padding: 1.25rem;
		border: 1px solid var(--line);
		border-radius: 1rem;
		background: rgba(12, 12, 15, 0.85);
	}
	.capacity-card {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}
	.capacity-card span,
	.variant-row span {
		color: var(--muted);
		font-size: 0.78rem;
	}
	.capacity-card strong {
		display: block;
		font-size: 2rem;
	}
	.capacity-form {
		grid-column: 1 / -1;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: end;
		padding-top: 1rem;
		border-top: 1px solid var(--line);
	}
	label {
		display: grid;
		gap: 0.35rem;
		color: var(--muted);
		font-size: 0.78rem;
	}
	input,
	select,
	button {
		font: inherit;
	}
	input,
	select {
		min-height: 2.5rem;
		padding: 0.4rem 0.55rem;
		border: 1px solid var(--line);
		border-radius: 0.45rem;
		background: #101014;
		color: var(--text);
	}
	button {
		min-height: 2.5rem;
		padding: 0.45rem 0.8rem;
		border: 1px solid rgba(234, 195, 143, 0.38);
		border-radius: 0.45rem;
		background: rgba(235, 183, 111, 0.1);
		color: var(--text);
		cursor: pointer;
	}
	.variants {
		margin-top: 1.5rem;
	}
	.variant-row {
		display: grid;
		grid-template-columns: 2fr 1fr auto auto auto auto;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 0;
		border-top: 1px solid var(--line);
	}
	.variant-row:first-of-type {
		border-top: 0;
	}
	.variant-row strong {
		display: block;
		text-transform: capitalize;
	}
	.message {
		padding: 0.75rem 1rem;
		border-radius: 0.6rem;
	}
	.error {
		background: rgba(145, 54, 54, 0.25);
	}
	.success {
		background: rgba(83, 128, 89, 0.2);
	}
	@media (max-width: 800px) {
		.capacity-card {
			grid-template-columns: repeat(2, 1fr);
		}
		.variant-row {
			grid-template-columns: 1fr 1fr;
		}
		.variant-row > div {
			grid-column: 1/-1;
		}
	}
</style>
