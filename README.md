# Holographe Site

## Development

```sh
npm install
npm run dev
```

## Stripe Checkout

The site now includes a server-side Stripe Checkout flow at `/checkout`.

Set this environment variable before using payments locally or on Vercel:

```sh
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_replace_me
RIVAL_QUEST_BLOB_PATHNAME=digital-products/rival-quest/Rival_Quest_Digital_Party_Game.zip
RIVAL_QUEST_BLOB_STORE_ID=optional_private_blob_store_id_for_oidc
RIVAL_QUEST_BLOB_READ_WRITE_TOKEN=optional_private_blob_store_token_for_preview_only
PUSHOVER_TOKEN=pushover_app_token_replace_me
PUSHOVER_USER_KEY=pushover_user_key_replace_me
```

`BLOB_READ_WRITE_TOKEN` is required for storing uploaded customer design files in Vercel Blob so they can be tied to checkout metadata.
`STRIPE_WEBHOOK_SECRET` is required for the `/api/stripe-webhook` endpoint so successful Checkout payments are recorded server-side.

## Halloween Edition inventory

Halloween inventory uses Neon PostgreSQL when configured. It tracks both per-SKU limits and the private collection-wide production capacity; no stock counts are exposed to customers.

Required server-side variables:

```bash
DATABASE_URL=postgresql://pooled_neon_connection_string_here
DIRECT_DATABASE_URL=postgresql://direct_neon_connection_string_here
INVENTORY_CRON_SECRET=replace_with_a_long_random_secret
```

Generate migrations with `npm run db:generate`. Apply the reviewed migration later with
`npm run db:migrate`; do not run that command until Neon is configured and the migration has been approved.

`POST /api/internal/inventory/cleanup` releases expired reservations and requires
`Authorization: Bearer $INVENTORY_CRON_SECRET`. A future Vercel Cron job may call this endpoint;
it is intentionally not configured by this repository.

The owner-only `/admin/inventory` route uses the same Basic Auth credentials as `/admin/orders`.
`RIVAL_QUEST_BLOB_PATHNAME` must point to `Rival_Quest_Digital_Party_Game.zip` inside a private Vercel Blob store; never place that ZIP in `static/` or commit it to Git.
`RIVAL_QUEST_BLOB_STORE_ID` is optional when Vercel OIDC/project Blob configuration already resolves the intended private store, and is useful when the project has more than one Blob store.
`RIVAL_QUEST_BLOB_READ_WRITE_TOKEN` is a preview-only fallback for the dedicated private Rival Quest store when Vercel cannot connect the store through OIDC because another Blob store already owns the default `BLOB_READ_WRITE_TOKEN` variable.
`PUSHOVER_TOKEN` and `PUSHOVER_USER_KEY` are optional, but when set they send a phone push alert for each newly paid order.

## Rival Quest Digital Product

`/games/rival-quest` sells the digital product through the existing Stripe Checkout route.
The Checkout Session is created with digital-product metadata and no shipping-address collection.
After payment, `/games/rival-quest/success` verifies the Stripe Checkout Session server-side before showing the download link.
`/games/rival-quest/download` verifies the session again, then streams `Rival_Quest_Digital_Party_Game.zip` from private Vercel Blob storage with `@vercel/blob` `get()` and `access: 'private'`.

Before production launch:

- Create or connect a private Vercel Blob store dedicated to Rival Quest.
- Upload `Rival_Quest_Digital_Party_Game.zip` to the private store at `digital-products/rival-quest/Rival_Quest_Digital_Party_Game.zip`.
- Set `RIVAL_QUEST_BLOB_PATHNAME` in Vercel for the deployment environment if using a different pathname.
- Set `RIVAL_QUEST_BLOB_STORE_ID` when OIDC needs an explicit store id to choose the dedicated private store.
- Set `RIVAL_QUEST_BLOB_READ_WRITE_TOKEN` only in Vercel environment configuration if the private Rival Quest store cannot be connected through OIDC; do not commit the value or expose it to client code.
- Complete Stripe test-mode checkout and protected-download verification before enabling production traffic.

## Production webhook

Add a Stripe webhook endpoint pointing to:

```txt
https://holographephoto.com/api/stripe-webhook
```

Subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

After Stripe signs those events, the site verifies the signature and stores the paid order record in Vercel Blob under `orders/stripe/<session-id>.json`.
If `PUSHOVER_TOKEN` and `PUSHOVER_USER_KEY` are configured, the webhook also sends a live push notification to your phone for each new paid order.

The pricing page now uses sale bundle pricing:

- `1`: `$19.99`
- `3`: `$34.99`
- `5`: `$59.99`
- `10-40`: discounted fixed bundle pricing
- `50+`: custom quote through `/contact`

## Validation

```sh
npm run check
```
