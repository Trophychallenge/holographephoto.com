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
RIVAL_QUEST_DOWNLOAD_URL=https://private-storage.example/Rival_Quest_Digital_Party_Game.zip
RIVAL_QUEST_DOWNLOAD_BEARER_TOKEN=optional_private_storage_bearer_token
PUSHOVER_TOKEN=pushover_app_token_replace_me
PUSHOVER_USER_KEY=pushover_user_key_replace_me
```

`BLOB_READ_WRITE_TOKEN` is required for storing uploaded customer design files in Vercel Blob so they can be tied to checkout metadata.
`STRIPE_WEBHOOK_SECRET` is required for the `/api/stripe-webhook` endpoint so successful Checkout payments are recorded server-side.
`RIVAL_QUEST_DOWNLOAD_URL` must point to the private server-side source for `Rival_Quest_Digital_Party_Game.zip`; never place that ZIP in `static/` or commit it to Git.
`RIVAL_QUEST_DOWNLOAD_BEARER_TOKEN` is optional and is sent only from the server when the configured download source requires bearer auth.
`PUSHOVER_TOKEN` and `PUSHOVER_USER_KEY` are optional, but when set they send a phone push alert for each newly paid order.

## Rival Quest Digital Product

`/games/rival-quest` sells the digital product through the existing Stripe Checkout route.
The Checkout Session is created with digital-product metadata and no shipping-address collection.
After payment, `/games/rival-quest/success` verifies the Stripe Checkout Session server-side before showing the download link.
`/games/rival-quest/download` verifies the session again, then streams `Rival_Quest_Digital_Party_Game.zip` from the server-only `RIVAL_QUEST_DOWNLOAD_URL`.

Before production launch:

- Upload `Rival_Quest_Digital_Party_Game.zip` to private storage that Vercel can fetch server-side.
- Set `RIVAL_QUEST_DOWNLOAD_URL` in Vercel for the deployment environment.
- Set `RIVAL_QUEST_DOWNLOAD_BEARER_TOKEN` only if that storage endpoint requires it.
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
