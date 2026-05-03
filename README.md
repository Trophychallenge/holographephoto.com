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
```

`BLOB_READ_WRITE_TOKEN` is required for storing uploaded customer design files in Vercel Blob so they can be tied to checkout metadata.
`STRIPE_WEBHOOK_SECRET` is required for the `/api/stripe-webhook` endpoint so successful Checkout payments are recorded server-side.

## Production webhook

Add a Stripe webhook endpoint pointing to:

```txt
https://holographephoto.com/api/stripe-webhook
```

Subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

After Stripe signs those events, the site verifies the signature and stores the paid order record in Vercel Blob under `orders/stripe/<session-id>.json`.

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
