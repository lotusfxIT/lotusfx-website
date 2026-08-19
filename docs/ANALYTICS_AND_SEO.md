# Analytics, SEO & Tracking

Audit snapshot for the LotusFX Next.js site. **Verify in production** after setting env vars on Vercel.

---

## Current state (from code)

### Google Tag Manager
- **Not installed previously.** Optional support added via `NEXT_PUBLIC_GTM_ID`.
- If set, GTM loads **once** in `components/analytics/AnalyticsScripts.tsx`.
- Direct `gtag.js` is **not** loaded when GTM is set (avoids duplicate GA4).

### Google Analytics 4
- Loaded **directly** via `gtag.js` when `NEXT_PUBLIC_GA_ID` is set and `NEXT_PUBLIC_GTM_ID` is empty.
- Uses `send_page_view: false` on config; `page_view` is fired manually via `AnalyticsPageView` (App Router navigations).
- **Vercel Analytics** (`@vercel/analytics`) runs separately — not a duplicate of GA4.

### Env variables (Vercel / `.env.local`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for sitemap, metadata, JSON-LD |
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID (e.g. `G-XXXXXXXX`) |
| `NEXT_PUBLIC_GTM_ID` | GTM container ID (e.g. `GTM-XXXXXXX`) — optional |
| `NEXT_PUBLIC_ANALYTICS_CONSENT_REQUIRED` | Set to `true` when consent banner ships |

**Do not set both GTM and direct GA4 to load the same GA4 property.**

### Consent
- No cookie banner yet.
- `lib/analytics-consent.ts` supports opt-in when `NEXT_PUBLIC_ANALYTICS_CONSENT_REQUIRED=true`.
- Until then, analytics runs in **production only** (`NODE_ENV === 'production'`).

### Privacy
- `lib/analytics.ts` blocks PII param keys (email, phone, name, address, etc.).
- Contact form events send `subject_category` only — never field values.

---

## Events implemented (real user actions)

| Event | When | Parameters (examples) |
|-------|------|------------------------|
| `page_view` | Route change | `page_path`, `page_title` |
| `view_rates` | Exchange rate API success | `quote_type`, `from_currency`, `to_currency`, `country` |
| `quote_type_select` | FX vs Transfer choice | `quote_type`, `location` |
| `order_initiation` | Quick Order / portal login | `cta_name`, `quote_type`, `country` |
| `cta_click` | Key CTAs | `cta_name`, `location` |
| `form_submit` | Contact form submit | `form_name`, `subject_category` |
| `location_interaction` | Branch detail loaded | `branch_slug`, `country` |
| `popup_interaction` | Homepage popup | `action` |

### Not implemented (by design)
- **`purchase`** — no online checkout yet. See `lib/analytics-ecommerce.ts`.

---

## Future checkout / purchase event

When payment goes live:

1. Confirm order **server-side** (API/webhook).
2. On order confirmation page, call `trackPurchaseOnce()` from `lib/analytics-ecommerce.ts`.
3. Pass: `transaction_id`, `value`, `currency`, `items[]`.
4. Duplicate protection uses `sessionStorage` per `transaction_id`.

**Do not** fire purchase from client-only UI or before payment confirmation.

---

## SEO

### Metadata
- Per-page titles, descriptions, canonical, Open Graph, Twitter via `lib/seo.ts` → `buildPageMetadata()`.
- Root layout: `metadataBase`, icons, manifest (no global canonical on `/`).

### Sitemap & robots
- `app/sitemap.ts` — dynamic sitemap (includes branches, currencies, service pages).
- `app/robots.ts` — disallows `/admin/`, `/api/`, test/auth routes.
- Removed stale `public/robots.txt` and `public/sitemap.xml`.

### Structured data
- Homepage: Organization, FinancialService, WebSite, BreadcrumbList (`components/StructuredData.tsx`).
- Branch pages: LocalBusiness JSON-LD (client-rendered on detail page).

### Gaps / follow-ups
- Blog post pages (`/blog/[slug]`) still client-rendered — add server metadata when CMS is stable.
- CMS pages (`/[slug]`) need per-slug metadata.
- OG image assets must exist in `public/images/` on production.
- Admin settings GA ID field is **not** wired to runtime — use Vercel env vars.

---

## GTM setup (when you add a container)

1. Create container in [tagmanager.google.com](https://tagmanager.google.com).
2. Set `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` in Vercel.
3. Configure GA4, Google Ads, Meta, etc. **inside GTM** (no IDs in code unless env-driven).
4. Map dataLayer events (`page_view`, `view_rates`, …) to GTM triggers.
5. Leave `NEXT_PUBLIC_GA_ID` empty if GA4 is loaded only via GTM.

---

## Testing checklist

- [ ] `NEXT_PUBLIC_SITE_URL` matches live domain (e.g. `https://stafflotusfx.com` or production URL)
- [ ] GA4 Realtime shows page views on navigation (not only full reload)
- [ ] No duplicate page views (check GA4 DebugView)
- [ ] View Page Source: unique `<title>`, `canonical`, `og:title` per route
- [ ] `/sitemap.xml` lists service pages + branches
- [ ] `/robots.txt` blocks admin/api
