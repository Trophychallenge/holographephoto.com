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
```

The pricing page now uses sale bundle pricing:

- `1`: `$14.99`
- `3`: `$34.99`
- `5`: `$59.99`
- `10-40`: discounted fixed bundle pricing
- `50+`: custom quote through `/contact`

## Validation

```sh
npm run check
```
