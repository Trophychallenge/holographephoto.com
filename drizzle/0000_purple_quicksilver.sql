CREATE TABLE "inventory_capacity" (
	"collection_key" text PRIMARY KEY NOT NULL,
	"total_units" integer NOT NULL,
	"reserved_units" integer DEFAULT 0 NOT NULL,
	"consumed_units" integer DEFAULT 0 NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_capacity_total_non_negative" CHECK ("inventory_capacity"."total_units" >= 0),
	CONSTRAINT "inventory_capacity_reserved_non_negative" CHECK ("inventory_capacity"."reserved_units" >= 0),
	CONSTRAINT "inventory_capacity_consumed_non_negative" CHECK ("inventory_capacity"."consumed_units" >= 0),
	CONSTRAINT "inventory_capacity_units_within_total" CHECK ("inventory_capacity"."reserved_units" + "inventory_capacity"."consumed_units" <= "inventory_capacity"."total_units")
);
--> statement-breakpoint
CREATE TABLE "inventory_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"reservation_id" uuid,
	"sku" text,
	"collection_key" text NOT NULL,
	"event_type" text NOT NULL,
	"quantity_delta" integer,
	"production_units_delta" integer,
	"actor" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_events_type_valid" CHECK ("inventory_events"."event_type" in ('replenishment', 'reservation', 'reservation_release', 'purchase', 'manual_adjustment', 'admin_action'))
);
--> statement-breakpoint
CREATE TABLE "inventory_reservations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"quantity" integer NOT NULL,
	"production_units_reserved" integer NOT NULL,
	"stripe_checkout_session_id" text,
	"status" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"fulfilled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_reservations_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id"),
	CONSTRAINT "inventory_reservations_quantity_positive" CHECK ("inventory_reservations"."quantity" > 0),
	CONSTRAINT "inventory_reservations_units_positive" CHECK ("inventory_reservations"."production_units_reserved" > 0),
	CONSTRAINT "inventory_reservations_status_valid" CHECK ("inventory_reservations"."status" in ('reserved', 'fulfilled', 'released', 'expired'))
);
--> statement-breakpoint
CREATE TABLE "inventory_variants" (
	"sku" text PRIMARY KEY NOT NULL,
	"collection_key" text NOT NULL,
	"design_slug" text NOT NULL,
	"variant_id" text NOT NULL,
	"production_units_per_item" integer NOT NULL,
	"inventory_quantity" integer DEFAULT 10 NOT NULL,
	"inventory_reserved" integer DEFAULT 0 NOT NULL,
	"inventory_consumed" integer DEFAULT 0 NOT NULL,
	"inventory_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_variants_production_units_positive" CHECK ("inventory_variants"."production_units_per_item" > 0),
	CONSTRAINT "inventory_variants_quantity_non_negative" CHECK ("inventory_variants"."inventory_quantity" >= 0),
	CONSTRAINT "inventory_variants_reserved_non_negative" CHECK ("inventory_variants"."inventory_reserved" >= 0),
	CONSTRAINT "inventory_variants_consumed_non_negative" CHECK ("inventory_variants"."inventory_consumed" >= 0),
	CONSTRAINT "inventory_variants_units_within_quantity" CHECK ("inventory_variants"."inventory_reserved" + "inventory_variants"."inventory_consumed" <= "inventory_variants"."inventory_quantity")
);
--> statement-breakpoint
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_reservation_id_inventory_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."inventory_reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_sku_inventory_variants_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."inventory_variants"("sku") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_reservations" ADD CONSTRAINT "inventory_reservations_sku_inventory_variants_sku_fk" FOREIGN KEY ("sku") REFERENCES "public"."inventory_variants"("sku") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_variants" ADD CONSTRAINT "inventory_variants_collection_key_inventory_capacity_collection_key_fk" FOREIGN KEY ("collection_key") REFERENCES "public"."inventory_capacity"("collection_key") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inventory_events_collection_created_idx" ON "inventory_events" USING btree ("collection_key","created_at");--> statement-breakpoint
CREATE INDEX "inventory_events_reservation_idx" ON "inventory_events" USING btree ("reservation_id");--> statement-breakpoint
CREATE INDEX "inventory_reservations_active_expiry_idx" ON "inventory_reservations" USING btree ("status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_variants_collection_design_variant_unique" ON "inventory_variants" USING btree ("collection_key","design_slug","variant_id");--> statement-breakpoint
CREATE INDEX "inventory_variants_collection_enabled_idx" ON "inventory_variants" USING btree ("collection_key","inventory_enabled");
--> statement-breakpoint
INSERT INTO "inventory_capacity" ("collection_key", "total_units", "reserved_units", "consumed_units", "enabled")
VALUES ('halloween-edition', 60, 0, 0, true)
ON CONFLICT ("collection_key") DO NOTHING;
--> statement-breakpoint
INSERT INTO "inventory_variants" (
	"sku",
	"collection_key",
	"design_slug",
	"variant_id",
	"production_units_per_item",
	"inventory_quantity",
	"inventory_reserved",
	"inventory_consumed",
	"inventory_enabled"
)
SELECT
	'halloween:' || designs.design_slug || ':' || variants.variant_id,
	'halloween-edition',
	designs.design_slug,
	variants.variant_id,
	variants.production_units_per_item,
	10,
	0,
	0,
	true
FROM (
	VALUES
		('haunted-hospital'),
		('pumpkin-patch-massacre'),
		('ghostly-graveyard'),
		('creepy-carnival'),
		('witches-brew'),
		('scream-season')
) AS designs(design_slug)
CROSS JOIN (
	VALUES
		('single.standard', 1),
		('single.personalized', 1),
		('mini4.standard', 2),
		('mini4.personalized', 2),
		('full.standard', 4),
		('custom.personalized', 5),
		('custom.full', 6)
) AS variants(variant_id, production_units_per_item)
ON CONFLICT ("sku") DO NOTHING;
