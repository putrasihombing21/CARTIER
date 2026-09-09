# Verification record

Completed on 7 September 2026.

- Production build succeeded with all page and API routes.
- TypeScript check passed.
- Nine checkout/payment tests passed: canonical totals, invalid quantity/size/ID rejection, contact validation, demo defaults and production lockout, same-origin requirement, request size limits, payment state mapping, signature verification, and sandbox redirect allowlisting with a mocked provider.
- SQLite migration executed successfully in a temporary test database. Duplicate and delayed updates did not overwrite paid/refunded states.
- Desktop browser: brand sections, navigation, original imagery, piece detail, size selection, bag quantities/totals, delivery form, demo payment, completion, and local email feedback checked.
- Mobile browser frames at 390 and 320 CSS pixels: hero, navigation and silhouette panels checked. Document widths matched their available width, with no horizontal overflow. Mobile section navigation and Escape dismissal checked.
- Motion-off control checked. Reduced-motion CSS and device checks are implemented. System-level reduced-motion emulation was not available in the browser tool.
- The cloud browser disables WebGL. The 3D support probe correctly falls back to the SVG emblem, without application errors. Actual GPU-rendered motion still requires checking on a WebGL-enabled browser.
- Midtrans merchant sandbox and webhook delivery were not exercised with credentials. The adapter was tested with a mocked provider. Live payments remain disabled.

No hosting deployment, domain purchase, real order, payment or email subscription occurred. Browser-extension diagnostics were excluded from application errors.

## Follow-up — 8 September 2026

- Confirmed the existing PR remains open and unmerged, with no review comments.
- Reproduced a phone-validation defect with a failing regression test: punctuation-only values and numbers longer than 15 digits were accepted.
- Fixed phone validation to require 8–15 digits while accepting common formatting.
- The downloadable preview and the application now call the same checkout validator before continuing to payment. The server still validates independently.
- All ten commerce tests and TypeScript passed.
- Production build passed. The regenerated 2.15 MB standalone preview passed JavaScript syntax and embedded-asset checks, including the updated shared validator.
- Browser regression check passed: an invalid phone stayed on the delivery form with a clear error; corrected synthetic details reached demo payment; simulated bank transfer reached the honest no-charge completion state.
- No application errors were observed during that flow. Browser-extension diagnostics were excluded.
- No layout, branding, provider connection or hosting settings were changed. Earlier limits on GPU verification, system-level reduced-motion emulation and merchant-sandbox testing still apply. The downloadable HTML was not separately browser-tested during this follow-up.

## Private deployment preparation — 9 September 2026

- The owner authorized private demo publication through Sites. Public access, GitHub PR merging and real payments remain out of scope.
- Reused the last successful build because application source and dependencies are unchanged. Verified the Worker entrypoint exports a default fetch handler and the prepared output includes the database migration.
- The application defaults to demo mode without payment credentials. No merchant or email service was connected.
- Registered the hosting manifest for owner-only review and added the review address to the beginner README. The native Sites deployment result is the authority for publication status.
- Earlier GPU, reduced-motion emulation and merchant-sandbox verification limitations remain unchanged.
