import { sql } from 'drizzle-orm';
import {
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';

export const inventoryCapacity = pgTable(
	'inventory_capacity',
	{
		collectionKey: text('collection_key').primaryKey(),
		totalUnits: integer('total_units').notNull(),
		reservedUnits: integer('reserved_units').notNull().default(0),
		consumedUnits: integer('consumed_units').notNull().default(0),
		enabled: boolean('enabled').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		check('inventory_capacity_total_non_negative', sql`${table.totalUnits} >= 0`),
		check('inventory_capacity_reserved_non_negative', sql`${table.reservedUnits} >= 0`),
		check('inventory_capacity_consumed_non_negative', sql`${table.consumedUnits} >= 0`),
		check(
			'inventory_capacity_units_within_total',
			sql`${table.reservedUnits} + ${table.consumedUnits} <= ${table.totalUnits}`
		)
	]
);

export const inventoryVariants = pgTable(
	'inventory_variants',
	{
		sku: text('sku').primaryKey(),
		collectionKey: text('collection_key')
			.notNull()
			.references(() => inventoryCapacity.collectionKey),
		designSlug: text('design_slug').notNull(),
		variantId: text('variant_id').notNull(),
		productionUnitsPerItem: integer('production_units_per_item').notNull(),
		inventoryQuantity: integer('inventory_quantity').notNull().default(10),
		inventoryReserved: integer('inventory_reserved').notNull().default(0),
		inventoryConsumed: integer('inventory_consumed').notNull().default(0),
		inventoryEnabled: boolean('inventory_enabled').notNull().default(true),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		uniqueIndex('inventory_variants_collection_design_variant_unique').on(
			table.collectionKey,
			table.designSlug,
			table.variantId
		),
		index('inventory_variants_collection_enabled_idx').on(
			table.collectionKey,
			table.inventoryEnabled
		),
		check('inventory_variants_production_units_positive', sql`${table.productionUnitsPerItem} > 0`),
		check('inventory_variants_quantity_non_negative', sql`${table.inventoryQuantity} >= 0`),
		check('inventory_variants_reserved_non_negative', sql`${table.inventoryReserved} >= 0`),
		check('inventory_variants_consumed_non_negative', sql`${table.inventoryConsumed} >= 0`),
		check(
			'inventory_variants_units_within_quantity',
			sql`${table.inventoryReserved} + ${table.inventoryConsumed} <= ${table.inventoryQuantity}`
		)
	]
);

export const inventoryReservations = pgTable(
	'inventory_reservations',
	{
		id: uuid('id').primaryKey(),
		sku: text('sku')
			.notNull()
			.references(() => inventoryVariants.sku),
		quantity: integer('quantity').notNull(),
		productionUnitsReserved: integer('production_units_reserved').notNull(),
		stripeCheckoutSessionId: text('stripe_checkout_session_id').unique(),
		status: text('status').notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		fulfilledAt: timestamp('fulfilled_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('inventory_reservations_active_expiry_idx').on(table.status, table.expiresAt),
		check('inventory_reservations_quantity_positive', sql`${table.quantity} > 0`),
		check('inventory_reservations_units_positive', sql`${table.productionUnitsReserved} > 0`),
		check(
			'inventory_reservations_status_valid',
			sql`${table.status} in ('reserved', 'fulfilled', 'released', 'expired')`
		)
	]
);

export const inventoryEvents = pgTable(
	'inventory_events',
	{
		id: uuid('id').primaryKey(),
		reservationId: uuid('reservation_id').references(() => inventoryReservations.id),
		sku: text('sku').references(() => inventoryVariants.sku),
		collectionKey: text('collection_key').notNull(),
		eventType: text('event_type').notNull(),
		quantityDelta: integer('quantity_delta'),
		productionUnitsDelta: integer('production_units_delta'),
		actor: text('actor'),
		metadata: jsonb('metadata').notNull().default({}),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
	},
	(table) => [
		index('inventory_events_collection_created_idx').on(table.collectionKey, table.createdAt),
		index('inventory_events_reservation_idx').on(table.reservationId),
		check(
			'inventory_events_type_valid',
			sql`${table.eventType} in ('replenishment', 'reservation', 'reservation_release', 'purchase', 'manual_adjustment', 'admin_action')`
		)
	]
);
