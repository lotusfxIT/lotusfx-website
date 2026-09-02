# Quick Order (in-site)

Port of the 4dDev `public-purchase-standalone.html` guest purchase wizard.

## Live route

- Page: `/quick-order`
- Hero + calculator CTAs link here (no longer `lotus-au-web-app.web.app`)

## Vercel env (required for create)

| Variable | Purpose |
|----------|---------|
| `QUICK_ORDER_API_URL` | Base URL — default `https://test.lotusfx.com` |
| `QUICK_ORDER_X_KEY` | API `X-KEY` — default `abc123` (4dDev test) |
| `QUICK_ORDER_X_CLIENT` | API `X-CLIENT` — default `LotusFX` |
| `QUICK_ORDER_GUEST_LIMIT` | Optional, default `1000` |
| `QUICK_ORDER_ENABLE_DELIVERY` | Optional, default off (`true` to enable) |

If Quick Order keys are unset, the server falls back to AU exchange-rate keys (`EXCHANGE_RATE_X_KEY_AU` / `EXCHANGE_RATE_X_CLIENT_AU`). Confirm with 4dDev that those credentials are allowed to call:

- `/rst/Currencies/getCurrenciesSold`
- `/rst/Branches/getBranches`
- `/rst/Currencies/getExchangeRate`
- `/rst/WebEWires/createPublicPurchaseOrder`

## Smoke test

1. Open `/quick-order`
2. Currency list + branch list load
3. Enter amount → rate appears
4. Choose store → enter details → Confirm order
5. See confirmation / order reference
6. GA4 Realtime / Meta Test events: `view_rates`, `quick_order_step`, `quick_order_complete`

## Notes

- Pay in store only for v1 (Monoova/PayTo not exposed)
- AU / AUD only for v1
- API keys stay server-side via `/api/quick-order/*`
