# CARTIER — Born After Midnight

The first CARTIER website: an original dark streetwear brand world, with a working demo shopping flow. This version is for private review. No real payments, email subscriptions, or orders are enabled.

## Start here — no coding experience needed

Private online review: [CARTIER — Born After Midnight](https://cartier-after-midnight.zyuryuz21.chatgpt.site). Sign in with the account that owns this Site. Access is restricted to the owner, and checkout stays in demo mode.

You can review the website without installing anything: download `review/cartier-preview.html` from this branch and open it in a modern browser. This self-contained review includes the original images, 3D emblem, mobile layout and demo checkout. It does not contact a payment provider.

To run and edit the complete project:

1. Install Node.js 22 LTS or newer. On Windows, use WSL because the build scripts use Bash. macOS needs GNU `timeout` for the verified build (`brew install coreutils`).
2. Download this branch using GitHub's **Code → Download ZIP**, and unzip it. Or use Git to clone this branch.
3. Open the folder in an editor such as VS Code.
4. Open a terminal inside that folder and run `npm ci`.
5. Run `npm run dev`.
6. Open the local address printed in the terminal. Leave the terminal running while you review.
7. Press Ctrl+C in that terminal when you want to stop.

No payment keys are needed for the demo. Demo is the default when no environment configuration is provided.

Useful checks:

```bash
npm run typecheck
npm run test:commerce
npm run build
npm run preview:file
```

The first three check the code, checkout rules, and production build. The last command creates a self-contained `review/cartier-preview.html` after the production build. The review file is a demo export; its checkout runs locally. The application itself uses the server checkout route.

Both versions use the same contact, address, bag and price validation. Phone numbers need 8–15 digits; a leading plus, spaces, brackets and hyphens are allowed. Invalid details keep you on the delivery form with a message explaining what to correct. The full application also repeats validation on the server.

## What is included

- Original editable SVG wordmark and split-ring emblem. These are temporary design studies.
- Short loading sequence; responsive navigation; keyboard focus states; mobile menu.
- Lazy-loaded chrome 3D emblem with pointer response. It pauses out of view.
- SVG fallback when 3D fails, reduced motion is requested, or data-saving mode is active.
- Brand world, 84-word manifesto, three silhouette studies, and original campaign imagery.
- Three concept pieces with sizes, demo IDR prices, bag quantity controls and removal.
- Contact and delivery form, server-validated totals, demo payment choice, and honest demo confirmation.
- Midtrans sandbox redirect integration, verified webhook, and protected order-status endpoint.
- Email validation with a clear local preview result; no subscription occurs.

The site uses Next.js App Router conventions, React, TypeScript and Tailwind CSS. Vinext builds and runs the Next-style app with Vite and a Cloudflare Worker. React Three Fiber and Three.js render the emblem. CSS handles other motion; no second animation library is needed. Existing accessible Radix/Shadcn components handle dialogs and drawers. Fonts are self-hosted through npm packages, not loaded from Google at runtime.

## Where to edit

| Change | File |
|---|---|
| Headlines, manifesto and page sections | `components/brand/brand-experience.tsx` |
| Colors, type sizes, spacing and mobile layout | `app/globals.css` |
| Browser title and page description | `app/layout.tsx` |
| Piece names, prices, descriptions and sizes | `lib/commerce/catalog.ts` |
| Chrome object geometry and lighting | `components/brand/metal-scene.tsx` |
| 3D loading and fallback rules | `components/brand/hero-object.tsx` |
| Editable prototype logos | `public/assets/wordmark.svg`, `public/assets/emblem.svg` |
| Campaign and garment images | `public/assets/*.webp` |
| Checkout validation | `lib/commerce/validation.ts` |
| Payment adapter and signature checks | `lib/commerce/payment.ts` |
| Checkout endpoint | `app/api/checkout/route.ts` |
| Payment webhook | `app/api/payments/notification/route.ts` |
| Order database and migration | `db/schema.ts`, `drizzle/0000_lyrical_the_hood.sql` |

To change an image, replace its file while keeping the filename. The garment study image is three equal columns: tee, jacket, coat. All copy is English. The original image prompts and concept notes are in `docs/asset-notes.md`.

## Commerce behavior

**Demo mode, active by default:** bag contents are a temporary device-local draft in localStorage. Only piece IDs, sizes and quantities are saved. Contact details are never saved in browser storage. The checkout server recalculates prices from the catalogue and ignores no client-supplied prices: extra fields are rejected. It validates sizes, quantities, duplicate entries, and contact/address fields. It returns a clearly labeled simulated reference, without storing an order or calling any provider. Completion clears the bag and contact form. The email list form does not send or save addresses.

**Sandbox integration, implemented but not connected or tested against a real merchant account:** Midtrans hosts payment entry on its own sandbox page. The server key stays server-side. Orders in this mode use Cloudflare D1; only item snapshots, amount, status, a hashed access token and timestamps are saved. Customer contact details go to the sandbox provider and are not stored in D1. A customer status request requires its unguessable access token. A return URL never proves payment. The webhook verifies the SHA-512 signature, checks the amount, fetches authoritative status from Midtrans, and preserves paid/refunded states against delayed notifications.

Production payments are intentionally unsupported in this prototype. Changing an environment value to `live` or `production` is rejected. Real checkout activation requires your approval, final products/prices, provider onboarding, shipping and tax decisions, store policies, inventory/fulfillment rules, and provider end-to-end testing. No customer accounts or admin dashboard were added.

## Connect sandbox later

This section is for the developer assisting with payment setup. Do not put keys in source files, screenshots, GitHub issues or chat.

1. Create or select your Midtrans merchant sandbox account, outside this prototype.
2. Configure ignored `.dev.vars` for the local Worker (or secret environment values on the future host):

```dotenv
PAYMENT_MODE=midtrans_sandbox
MIDTRANS_SERVER_KEY=your-sandbox-server-key
SITE_ORIGIN=https://your-approved-test-host
```

3. Use the server key for the sandbox environment only. No frontend client key is needed because this integration uses a hosted redirect.
4. Bind D1 as `DB` and apply the checked-in migration before provider tests. The Sites hosting pipeline can apply Drizzle migrations when publication is separately approved. For another Cloudflare setup, use that setup's Wrangler configuration and D1 migration command; do not run runtime schema creation.
5. Set the sandbox payment notification URL to `/api/payments/notification` on the approved test host. Configure finish, unfinish and error redirects to `/order-status`; the create-transaction request supplies a specific finish URL with the order access token.
6. Test pending, completed, rejected and expired payments using Midtrans sandbox test details. Repeated notifications must be safe. No test credentials are included here.

This branch makes no external payment calls by default. An externally reachable approved test host is required for provider webhook testing.

Official implementation references: [Midtrans Snap integration](https://docs.midtrans.com/docs/snap-snap-integration-guide), [webhook handling](https://docs.midtrans.com/docs/https-notification-webhooks), and [notification signatures](https://docs.midtrans.com/reference/handle-notifications).

## Preview checks

`/?three=off` explicitly shows the static emblem for fallback testing. Your device's reduced-motion preference removes the loader and continuous motion. The visible **MOTION OFF** control pauses 3D and CSS animation. Modern browsers get subtle scroll reveals; unsupported browsers retain fully visible content.

Images are compressed WebP with fixed dimensions and lazy loading below the fold. There is no autoplay audio, analytics or tracking. Instagram and email are intentionally marked coming soon; replace them with verified brand destinations before launch.

## Review and publication

All website work is on `cartier-website-v1`. Review the Pull Request before merging. The owner approved a private demo deployment through Sites on 9 September 2026. Public access, merging the GitHub Pull Request and real payments still require separate approval. No domain was purchased and no live payment or email service was connected. The repository began empty; its initial base commit contains only `.gitkeep` so GitHub can compare the website branch in a Pull Request.
