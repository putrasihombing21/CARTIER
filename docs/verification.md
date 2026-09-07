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
