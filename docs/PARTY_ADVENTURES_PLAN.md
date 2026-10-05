# Party Adventures Planning Notes

Status: planning only. No application code, Stripe configuration, production data, or Christina OS data was changed during inspection.

## Product

Collection: Party Adventures

First edition: The Rival Quest Party System - Dragon Clan vs. Werewolf Pack

The product is a complete team-vs-team children's birthday-party system with a printed book, digital printable companion pack, Quest Master parent guide, challenge cards, team cards, awards, treasure pieces, signs, invitations, and optional personalized or deluxe versions.

## Repository inspected

Local repository: `/home/chris/holographe-site`

Branch: `main`

HEAD at inspection: `4ce6bf7 Refine pricing order flow`

Pre-existing untracked files were preserved:

- `Itsabeautifullifevideo`
- `Itsabeautifullifevideo:Zone.Identifier`
- `New Text Document.txt`

## Existing architecture

- SvelteKit 2, Svelte 5, and TypeScript.
- Vercel deployment adapter.
- Stripe Checkout through server-side HTTP requests.
- Vercel Blob for uploaded files and paid-order JSON snapshots.
- Vercel Analytics.
- Optional Pushover notifications.
- No database in the Holographe website repository.
- Product definitions are hardcoded in `src/lib/pricing.ts`.
- Current public routes include `/`, `/prices`, `/customize`, `/formats`, `/gallery`, `/technology`, `/contact`, and checkout success/cancel pages.
- Current operations route: `/admin/orders`.

The existing Holographe checkout is for custom photo products. It creates dynamic Stripe `price_data` line items, collects US shipping addresses and phone numbers, allows Stripe promotion codes, and passes photo/customization metadata. It does not use durable Stripe Product or Price IDs.

The Holographe site stores paid-order snapshots in Vercel Blob under `orders/stripe/<session-id>.json`. Its webhook currently handles successful Checkout Session events. It does not implement customer digital entitlements, protected downloads, refund handling, application-managed confirmation emails, or a product catalog database.

The current upload endpoint stores uploaded files with public Vercel Blob access. This public-file behavior must not be reused for paid companion downloads or sensitive customer assets.

Christina OS is a separate Next.js application at `/home/chris/christina-business-os`, backed by PostgreSQL and Prisma. Its Stripe processor handles orders, customers, revenue, refunds, disputes, event history, production jobs, and owner notifications. Local source describes the direct Holographe website-order webhook as future work. Stripe is currently the likely shared authority, but actual production webhook routing must be verified before implementation.

## Recommended product architecture

Party Adventures should be a separate product collection inside the existing SvelteKit site, while preserving the existing Holographe photo checkout flow.

Recommended future structure:

```text
src/routes/party-adventures/
  +page.svelte
  dragon-vs-werewolf/
    +page.svelte
  dragon-vs-werewolf/companion/
    +page.svelte

src/lib/party-adventures/
  catalog.ts
  checkout.ts
  access.ts
  types.ts

src/routes/api/party-adventures/
  checkout/+server.ts
  downloads/[token]/+server.ts
```

Party Adventures should use its own product-aware checkout metadata namespace and server-side variant allowlist. It should not add Party Adventures fields directly to the current photo-customization checkout.

## Party Modes

Each themed edition should support reusable Party Mode configurations. Modes are included choices/configurations of one edition when practical, not separate products.

```ts
type PartyModeKey =
  | "standard"
  | "pool"
  | "indoor-rainy-day"
  | "park"
  | "sleepover"
  | "holiday"
  | "classroom";

type PartyMode = {
  key: PartyModeKey;
  name: string;
  description: string;
  includedMaterials: string[];
  challengeIds: string[];
  setupInstructions: string[];
  runOfShow: string[];
  safetyRules: string[];
  dryAlternatives?: string[];
  available: boolean;
};
```

An edition should define its available modes and default mode. The first edition should offer Standard Party Mode and Pool Party Mode.

### Standard Party Mode

Designed for indoor parties, backyards, parks, and general birthday venues. It includes the core Rival Quest challenges, hidden treasure, coins, Golden Keys, awards, team cards, challenge cards, and the final battle, with the standard Quest Master setup and run of show.

### Pool Party Mode

Pool Mode must be a complete adaptation, not a paragraph of suggestions. It should include:

- Water-appropriate Quest Challenges.
- Poolside treasure placement instructions.
- Wet-safe or water-resistant materials.
- Revised setup instructions.
- A complete pool-party run of show.
- Dry-zone staging for paper cards, treasure chests, coins, awards, and electronics.
- Team activities that can happen in or beside the pool when safe and permitted.
- Dry alternatives for children who do not want to swim or get wet.

Quest Masters and Water Watchers must be distinct roles. Quest Masters manage story, challenges, coins, teams, and awards. Water Watchers actively supervise the pool and must not simultaneously run challenges, award coins, use phones, take photographs, operate music, or perform other party roles during active swimming.

Pool Mode must defer to venue rules and lifeguard instructions. It must never instruct children to retrieve treasure underwater, hold their breath, race through unsafe areas, push, dunk, jump over others, or perform activities that conflict with venue or lifeguard rules. Optional splash activities require appropriateness, consent, and venue permission.

Dragon Clan vs. Werewolf Pack should be positioned as especially compatible with Pool Party Mode because it was inspired by and tested at a real pool birthday. That statement should remain a factual product-story claim and should be confirmed as approved marketing language before publication.

## Featured Boss Quest: Karaoke Freeze Dance

Karaoke Freeze Dance should be a reusable signature Rival Quest group activity and should be featured prominently on the product page.

The activity includes family-friendly singing or performance, team dancing, music pauses or a `FREEZE` call, and dramatic dragon or werewolf poses. Quest Masters may award coins for creativity, commitment, teamwork, humor, helping shy players participate, and excellent frozen creature poses. No child is eliminated for moving.

Children who do not want to sing or dance can be music controller, freeze caller, pose judge, cheerleader, or helper.

The no-karaoke-equipment version can use a phone-safe indoor setup, portable speaker, instrumental track, or adults singing.

In Pool Mode, everyone must leave the water first. The activity occurs only on a dry, non-slip area safely away from the pool edge. Water Watchers remain focused on anyone still in the pool, and all electronics remain dry and safely positioned.

## Product page behavior

The product page should show a clear Party Mode selector with Standard Party Mode and Pool Party Mode as included choices. When the mode changes, the page should update:

- Included instructions.
- Included printables.
- Challenge list.
- Setup requirements.
- Run of show.
- Safety guidance.
- Dry alternatives.
- Any price difference caused by physical materials or fulfillment.

The selected mode must be passed to Stripe metadata and Christina OS order-item data. Future modes should be addable without changing the product or checkout model: Indoor/Rainy Day, Park Adventure, Sleepover, Holiday, and Classroom/School Party.

## Planned variants

The Rival Quest product should eventually support:

- Digital Party Pack.
- Printed Book.
- Personalized Birthday Edition.
- Deluxe Physical Party Kit.

Digital orders should create protected download entitlements. Printed and deluxe orders should collect shipping information and begin with manual fulfillment until a provider is selected. Personalized orders should capture structured fields and require manual review before fulfillment.

The printed book QR code should lead to a stable companion page, but paid files should remain private. A future implementation should use a unique access code or order-linked entitlement plus short-lived protected download responses. Static public PDF URLs are not recommended.

## Stripe and Christina OS contract

Before checkout implementation, define and test a metadata contract such as:

```text
business = holographe
collection = party-adventures
product = rival-quest-party-system
edition = dragon-clan-vs-werewolf-pack
mode = standard | pool
variant = digital-pack | printed-book | personalized-edition | deluxe-kit
fulfillment_type = digital | physical
personalization_status = none | required | submitted | approved
download_entitlement = yes | no
```

Stripe remains the payment authority. Christina OS should normalize these fields into the Holographe order, customer, order item, financial, fulfillment, and future download-entitlement records without weakening existing Holographe/TCC separation.

## Staged implementation plan

1. Confirm product contents, prices, margins, personalization fields, fulfillment assumptions, and companion files.
2. Add typed Party Adventures catalog data without changing current checkout.
3. Add `/party-adventures` and `/party-adventures/dragon-vs-werewolf`.
4. Add Standard and Pool Mode content bundles and the product-page selector.
5. Define and test the Party Adventures Stripe metadata contract.
6. Add a dedicated server-side checkout endpoint with allowlisted variants and prices.
7. Add protected companion access and digital download entitlements.
8. Add physical, personalized, and deluxe fulfillment states with manual approval where needed.
9. Verify Stripe webhook routing in Preview/Staging before touching Production.
10. Extend Christina OS normalization and reporting only after the contract is approved.

## Decisions still needed

- Final contents of each edition and mode.
- Prices, costs, margins, and whether modes affect price.
- Whether the book includes digital access automatically.
- QR access method and customer support process for lost access codes.
- Personalization fields and proof/approval rules.
- Printed book specifications.
- Deluxe kit contents, inventory, assembly, and shipping assumptions.
- Initial manual fulfillment process.
- Customer email provider and confirmation-email requirements.
- Whether Party Adventures appears in the primary Holographe navigation at launch.
- Whether Christina OS should consume the same Stripe events or receive a new signed website-order webhook.

## Resume prompt

Implement the approved Party Adventures catalog foundation in `/home/chris/holographe-site`. Add typed catalog data and customer-facing routes for `/party-adventures` and `/party-adventures/dragon-vs-werewolf`, including Standard Party Mode and Pool Party Mode selectors and content structures. Preserve existing Holographe photo checkout behavior. Do not connect live Stripe products, modify webhooks, publish downloads, alter Christina OS data, or add fulfillment integrations until product decisions and the protected-download model are approved.
