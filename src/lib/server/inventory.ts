import { randomUUID } from 'node:crypto';
import type { DatabaseClient } from './db';
import { withDatabaseClient, withDatabaseTransaction } from './db';

export const HALLOWEEN_COLLECTION_KEY = 'halloween-edition';
export const HALLOWEEN_RESERVATION_MINUTES = 30;

type CapacityRow = {
	collection_key: string;
	total_units: number;
	reserved_units: number;
	consumed_units: number;
	enabled: boolean;
};

type VariantRow = {
	sku: string;
	collection_key: string;
	design_slug: string;
	variant_id: string;
	production_units_per_item: number;
	inventory_quantity: number;
	inventory_reserved: number;
	inventory_consumed: number;
	inventory_enabled: boolean;
};

type ReservationRow = {
	id: string;
	sku: string;
	quantity: number;
	production_units_reserved: number;
	stripe_checkout_session_id: string | null;
	status: 'reserved' | 'fulfilled' | 'released' | 'expired';
};

export class InventoryUnavailableError extends Error {
	publicMessage = 'This edition is currently unavailable.';
}

function availableUnits(row: CapacityRow) {
	return row.total_units - row.reserved_units - row.consumed_units;
}

function availableQuantity(row: VariantRow) {
	return row.inventory_quantity - row.inventory_reserved - row.inventory_consumed;
}

async function insertEvent(
	client: DatabaseClient,
	input: {
		reservationId?: string;
		sku?: string;
		eventType: string;
		quantityDelta?: number;
		productionUnitsDelta?: number;
		actor?: string;
		metadata?: Record<string, unknown>;
	}
) {
	await client.query(
		`INSERT INTO inventory_events (id, reservation_id, sku, collection_key, event_type, quantity_delta, production_units_delta, actor, metadata)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`,
		[
			randomUUID(),
			input.reservationId ?? null,
			input.sku ?? null,
			HALLOWEEN_COLLECTION_KEY,
			input.eventType,
			input.quantityDelta ?? null,
			input.productionUnitsDelta ?? null,
			input.actor ?? null,
			JSON.stringify(input.metadata ?? {})
		]
	);
}

async function lockCapacity(client: DatabaseClient) {
	const result = await client.query<CapacityRow>(
		'SELECT * FROM inventory_capacity WHERE collection_key = $1 FOR UPDATE',
		[HALLOWEEN_COLLECTION_KEY]
	);
	if (!result.rows[0]) throw new Error('Halloween inventory capacity is not initialized.');
	return result.rows[0];
}

async function lockVariant(client: DatabaseClient, sku: string) {
	const result = await client.query<VariantRow>(
		'SELECT * FROM inventory_variants WHERE sku = $1 FOR UPDATE',
		[sku]
	);
	if (!result.rows[0]) throw new InventoryUnavailableError();
	return result.rows[0];
}

async function releaseReservationInTransaction(
	client: DatabaseClient,
	reservation: ReservationRow,
	status: 'released' | 'expired',
	actor: string
) {
	if (reservation.status !== 'reserved') return false;
	await lockCapacity(client);
	await lockVariant(client, reservation.sku);
	await client.query(
		`UPDATE inventory_capacity
		 SET reserved_units = reserved_units - $1, updated_at = now()
		 WHERE collection_key = $2`,
		[reservation.production_units_reserved, HALLOWEEN_COLLECTION_KEY]
	);
	await client.query(
		`UPDATE inventory_variants
		 SET inventory_reserved = inventory_reserved - $1, updated_at = now()
		 WHERE sku = $2`,
		[reservation.quantity, reservation.sku]
	);
	await client.query(
		`UPDATE inventory_reservations SET status = $1, updated_at = now() WHERE id = $2`,
		[status, reservation.id]
	);
	await insertEvent(client, {
		reservationId: reservation.id,
		sku: reservation.sku,
		eventType: 'reservation_release',
		quantityDelta: -reservation.quantity,
		productionUnitsDelta: -reservation.production_units_reserved,
		actor,
		metadata: { status }
	});
	return true;
}

async function releaseExpiredReservationsInTransaction(client: DatabaseClient) {
	const result = await client.query<ReservationRow>(
		`SELECT id, sku, quantity, production_units_reserved, stripe_checkout_session_id, status
		 FROM inventory_reservations
		 WHERE status = 'reserved' AND expires_at <= now()
		 FOR UPDATE`
	);
	let released = 0;
	for (const reservation of result.rows) {
		if (await releaseReservationInTransaction(client, reservation, 'expired', 'expiration-cleanup'))
			released += 1;
	}
	return released;
}

export async function releaseExpiredReservations() {
	return withDatabaseTransaction((client) => releaseExpiredReservationsInTransaction(client));
}

export async function reserveHalloweenInventory({
	sku,
	quantity
}: {
	sku: string;
	quantity: number;
}) {
	if (!Number.isSafeInteger(quantity) || quantity < 1) throw new InventoryUnavailableError();

	return withDatabaseTransaction(async (client) => {
		await releaseExpiredReservationsInTransaction(client);
		const capacity = await lockCapacity(client);
		const variant = await lockVariant(client, sku);
		const productionUnits = variant.production_units_per_item * quantity;

		if (
			!capacity.enabled ||
			!variant.inventory_enabled ||
			availableQuantity(variant) < quantity ||
			availableUnits(capacity) < productionUnits
		) {
			throw new InventoryUnavailableError();
		}

		const id = randomUUID();
		const expiresAt = new Date(Date.now() + HALLOWEEN_RESERVATION_MINUTES * 60_000);
		await client.query(
			`UPDATE inventory_capacity SET reserved_units = reserved_units + $1, updated_at = now() WHERE collection_key = $2`,
			[productionUnits, HALLOWEEN_COLLECTION_KEY]
		);
		await client.query(
			`UPDATE inventory_variants SET inventory_reserved = inventory_reserved + $1, updated_at = now() WHERE sku = $2`,
			[quantity, sku]
		);
		await client.query(
			`INSERT INTO inventory_reservations (id, sku, quantity, production_units_reserved, status, expires_at)
			 VALUES ($1, $2, $3, $4, 'reserved', $5)`,
			[id, sku, quantity, productionUnits, expiresAt]
		);
		await insertEvent(client, {
			reservationId: id,
			sku,
			eventType: 'reservation',
			quantityDelta: quantity,
			productionUnitsDelta: productionUnits,
			actor: 'checkout-preparation'
		});
		return { id, sku, expiresAt };
	});
}

export async function attachReservationToCheckout({
	reservationId,
	checkoutSessionId
}: {
	reservationId: string;
	checkoutSessionId: string;
}) {
	return withDatabaseTransaction(async (client) => {
		const result = await client.query<ReservationRow>(
			`SELECT id, sku, quantity, production_units_reserved, stripe_checkout_session_id, status
			 FROM inventory_reservations WHERE id = $1 FOR UPDATE`,
			[reservationId]
		);
		const reservation = result.rows[0];
		if (!reservation || reservation.status !== 'reserved') throw new InventoryUnavailableError();
		await client.query(
			`UPDATE inventory_reservations SET stripe_checkout_session_id = $1, updated_at = now() WHERE id = $2`,
			[checkoutSessionId, reservationId]
		);
	});
}

export async function fulfillReservation(checkoutSessionId: string) {
	return withDatabaseTransaction(async (client) => {
		const result = await client.query<ReservationRow>(
			`SELECT id, sku, quantity, production_units_reserved, stripe_checkout_session_id, status
			 FROM inventory_reservations WHERE stripe_checkout_session_id = $1 FOR UPDATE`,
			[checkoutSessionId]
		);
		const reservation = result.rows[0];
		if (!reservation || reservation.status === 'fulfilled') return false;
		if (reservation.status !== 'reserved') throw new Error('Reservation is no longer fulfillable.');
		await lockCapacity(client);
		await lockVariant(client, reservation.sku);
		await client.query(
			`UPDATE inventory_capacity SET reserved_units = reserved_units - $1, consumed_units = consumed_units + $1, updated_at = now() WHERE collection_key = $2`,
			[reservation.production_units_reserved, HALLOWEEN_COLLECTION_KEY]
		);
		await client.query(
			`UPDATE inventory_variants SET inventory_reserved = inventory_reserved - $1, inventory_consumed = inventory_consumed + $1, updated_at = now() WHERE sku = $2`,
			[reservation.quantity, reservation.sku]
		);
		await client.query(
			`UPDATE inventory_reservations SET status = 'fulfilled', fulfilled_at = now(), updated_at = now() WHERE id = $1`,
			[reservation.id]
		);
		await insertEvent(client, {
			reservationId: reservation.id,
			sku: reservation.sku,
			eventType: 'purchase',
			quantityDelta: reservation.quantity,
			productionUnitsDelta: reservation.production_units_reserved,
			actor: 'stripe-webhook'
		});
		return true;
	});
}

export async function releaseReservationForExpiredCheckout(checkoutSessionId: string) {
	return withDatabaseTransaction(async (client) => {
		const result = await client.query<ReservationRow>(
			`SELECT id, sku, quantity, production_units_reserved, stripe_checkout_session_id, status
			 FROM inventory_reservations WHERE stripe_checkout_session_id = $1 FOR UPDATE`,
			[checkoutSessionId]
		);
		const reservation = result.rows[0];
		return reservation
			? releaseReservationInTransaction(client, reservation, 'expired', 'stripe-session-expired')
			: false;
	});
}

export async function releaseReservation(reservationId: string) {
	return withDatabaseTransaction(async (client) => {
		const result = await client.query<ReservationRow>(
			`SELECT id, sku, quantity, production_units_reserved, stripe_checkout_session_id, status
			 FROM inventory_reservations WHERE id = $1 FOR UPDATE`,
			[reservationId]
		);
		const reservation = result.rows[0];
		return reservation
			? releaseReservationInTransaction(client, reservation, 'released', 'checkout-failure')
			: false;
	});
}

export async function getInventoryDashboard() {
	await releaseExpiredReservations();
	return withDatabaseClient(async (client) => {
		const capacity = await client.query<CapacityRow>(
			'SELECT * FROM inventory_capacity WHERE collection_key = $1',
			[HALLOWEEN_COLLECTION_KEY]
		);
		const variants = await client.query<VariantRow>(
			'SELECT * FROM inventory_variants WHERE collection_key = $1 ORDER BY design_slug, variant_id',
			[HALLOWEEN_COLLECTION_KEY]
		);
		return { capacity: capacity.rows[0] ?? null, variants: variants.rows };
	});
}

export async function setCapacity({
	totalUnits,
	enabled,
	actor
}: {
	totalUnits?: number;
	enabled?: boolean;
	actor: string;
}) {
	return withDatabaseTransaction(async (client) => {
		const capacity = await lockCapacity(client);
		const nextTotal = totalUnits ?? capacity.total_units;
		const nextEnabled = enabled ?? capacity.enabled;
		if (
			!Number.isSafeInteger(nextTotal) ||
			nextTotal < capacity.reserved_units + capacity.consumed_units
		)
			throw new Error('Capacity cannot be below reserved and consumed units.');
		await client.query(
			`UPDATE inventory_capacity SET total_units = $1, enabled = $2, updated_at = now() WHERE collection_key = $3`,
			[nextTotal, nextEnabled, HALLOWEEN_COLLECTION_KEY]
		);
		await insertEvent(client, {
			eventType: totalUnits === undefined ? 'admin_action' : 'manual_adjustment',
			productionUnitsDelta: nextTotal - capacity.total_units,
			actor,
			metadata: { enabled: nextEnabled }
		});
	});
}

export async function setVariantInventory({
	sku,
	inventoryQuantity,
	enabled,
	actor
}: {
	sku: string;
	inventoryQuantity?: number;
	enabled?: boolean;
	actor: string;
}) {
	return withDatabaseTransaction(async (client) => {
		await lockCapacity(client);
		const variant = await lockVariant(client, sku);
		const nextQuantity = inventoryQuantity ?? variant.inventory_quantity;
		const nextEnabled = enabled ?? variant.inventory_enabled;
		if (
			!Number.isSafeInteger(nextQuantity) ||
			nextQuantity < variant.inventory_reserved + variant.inventory_consumed
		)
			throw new Error('SKU quantity cannot be below reserved and consumed quantity.');
		await client.query(
			`UPDATE inventory_variants SET inventory_quantity = $1, inventory_enabled = $2, updated_at = now() WHERE sku = $3`,
			[nextQuantity, nextEnabled, sku]
		);
		await insertEvent(client, {
			sku,
			eventType: inventoryQuantity === undefined ? 'admin_action' : 'manual_adjustment',
			quantityDelta: nextQuantity - variant.inventory_quantity,
			actor,
			metadata: { enabled: nextEnabled }
		});
	});
}
