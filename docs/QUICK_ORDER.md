# Quick Order (in-site)

Port of the 4dDev `public-purchase-standalone.html` guest purchase wizard.

## Live route

- Page: `/quick-order`
- Hero + calculator CTAs link here (no longer `lotus-au-web-app.web.app`)
- Uses the site country selector: **AU**, **NZ**, or **FJ**

## Country backends

| Country | Base currency | Default API host |
|---------|---------------|------------------|
| AU | AUD | `https://test.lotusfx.com` (test server — keep for now) |
| NZ | NZD | `https://nz.app.lotusfx.com` |
| FJ | FJD | `https://fj.app.lotusfx.com` |

## Vercel env

### Australia (test)

| Variable | Purpose |
|----------|---------|
| `QUICK_ORDER_API_URL` / `QUICK_ORDER_API_URL_AU` | Default `https://test.lotusfx.com` |
| `QUICK_ORDER_X_KEY` / `QUICK_ORDER_X_KEY_AU` | Default `abc123` |
| `QUICK_ORDER_X_CLIENT` / `QUICK_ORDER_X_CLIENT_AU` | Default `LotusFX` |

### New Zealand (live portal)

| Variable | Purpose |
|----------|---------|
| `QUICK_ORDER_API_URL_NZ` | Optional — default `https://nz.app.lotusfx.com` |
| `QUICK_ORDER_X_KEY_NZ` | Optional — falls back to `EXCHANGE_RATE_X_KEY_NZ` |
| `QUICK_ORDER_X_CLIENT_NZ` | Optional — falls back to `EXCHANGE_RATE_X_CLIENT_NZ` |

### Shared optional

| Variable | Purpose |
|----------|---------|
| `QUICK_ORDER_GUEST_LIMIT` | Optional, default `1000` (or `_AU` / `_NZ` / `_FJ`) |
| `QUICK_ORDER_ENABLE_DELIVERY` | Optional, default off |

NZ create/rate/currencies/branches will fail until NZ keys are set (same as exchange-rate).

## Endpoints called

- `/rst/Currencies/getCurrenciesSold`
- `/rst/Branches/getBranches`
- `/rst/Currencies/getExchangeRate`
- `/rst/WebEWires/createPublicPurchaseOrder`

## Smoke test

1. Set country to **New Zealand** → open `/quick-order`
2. Confirm NZD amounts, NZ branches, NZ rates
3. Switch to **Australia** → still hits test.lotusfx.com
4. GA4 / Meta: `view_rates`, `quick_order_step`, `quick_order_complete`

## Notes

- Pay in store only for v1 (Monoova/PayTo not exposed)
- API keys stay server-side via `/api/quick-order/*`
