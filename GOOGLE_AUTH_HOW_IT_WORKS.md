# How Google Auth Works (No More Manual Login Every Time)

This explains why you used to sign in with your Google profile every time you opened the site/software, and why it now works **automatically** for months without clicking “Sign in with Google”.

---

## Short answer

You authenticated **once**. Google gave the app a long-lived **refresh token**. That token is saved in the server environment as `GOOGLE_REFRESH_TOKEN`.

Whenever Google’s short-lived **access token** expires (~1 hour), the server silently asks Google for a new one using the refresh token. **You never need to open the Google login popup again**, unless the refresh token is revoked or deleted.

---

## The two tokens (this is the whole trick)

| Token | Lifetime | What it’s for |
|--------|----------|----------------|
| **Access token** | ~1 hour | Used on every Google My Business / reviews API call |
| **Refresh token** | Long-lived (months/years until revoked) | Used only by the server to get a new access token |

**Before:** the browser (or you) held only an access token (or you re-logged each session). When it expired, Google rejected requests → you had to sign in again.

**Now:** the server keeps `GOOGLE_REFRESH_TOKEN` in env (Vercel / `.env.local`). Code in `lib/google-auth-server.ts` (`getValidServerAccessToken`) does this:

1. If a valid access token is already in memory → use it  
2. Else if `GOOGLE_ACCESS_TOKEN` in env is still valid → use it  
3. Else → call Google’s token endpoint with `grant_type=refresh_token` + `GOOGLE_REFRESH_TOKEN` → get a fresh access token  

No browser. No Google login screen. Fully automatic.

```text
You (one time)          Server (every API call)
───────────────         ───────────────────────
Sign in with Google  →  Stores GOOGLE_REFRESH_TOKEN in env
        │
        ▼
Google returns:
  • access_token (~1h)
  • refresh_token (long-lived)  ──► saved forever in env

Later, every hour or so:
  Server → Google: “here’s refresh_token, give me a new access_token”
  Google → Server: new access_token
  Server → My Business API: fetch locations / reviews
```

---

## What you did once (setup)

1. Ran the OAuth flow (historically via `/auth` → Google consent → `/auth/callback`).  
2. Google returned tokens; the callback stored them in the browser (`localStorage`) and/or you copied the refresh token into env.  
3. You set on the **server** (local `.env.local` and/or Vercel):

   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`  
   - `GOOGLE_CLIENT_SECRET`  
   - `GOOGLE_REFRESH_TOKEN` ← **this is why it auto-works**  

4. After that, endpoints like `/api/locations/details`, `/api/customer-reviews`, and `/api/cache-it-all` call `getValidServerAccessToken()` — they never ask you to log in.

---

## What uses this today

Anything that talks to Google Business Profile / My Business on the **server**:

- Branch page details + reviews (`/api/locations/details`) — with 1-day cache  
- Customer Reviews page (`/api/customer-reviews`) — with 1-day cache  
- Hidden warmup (`/api/cache-it-all?key=…`)  
- Cached locations list (`/api/locations/cached`)  

Visitors of the public website **do not** sign in with Google. Only the **server** uses your business account’s refresh token behind the scenes.

---

## Why it felt “every time” before

Common older patterns:

- Token only in **browser localStorage** → cleared when you cleared storage / new device / private window  
- Only an **access token** saved → dies every ~1 hour  
- No **server-side** `GOOGLE_REFRESH_TOKEN` → each session needed a human login  

Once the refresh token lived in **server env**, the app stopped needing you.

---

## Is the refresh token valid forever?

**Not guaranteed forever** — but it can last a very long time (months/years) with no action from you.

### Usual case

For a normal Google Cloud OAuth client with a **refresh token** saved as `GOOGLE_REFRESH_TOKEN`, it keeps working indefinitely until something invalidates it. That’s why you can go months without re-login.

### When it stops working

- You (or Google) **revoke** the app’s access  
- You change Google password / security settings in a way that clears sessions  
- The OAuth app is in **Testing** mode and the test user’s grant expires (Google often limits this to ~7 days for test apps — production/verified apps don’t have that short limit)  
- You delete or replace `GOOGLE_REFRESH_TOKEN` in env  
- Client ID/secret change and the old refresh token no longer matches  

### Practical takeaway

Treat it as **“set once, works until revoked”**, not a literal forever guarantee. If branch reviews or `/api/cache-it-all` suddenly fail auth, re-run the one-time `/auth` flow and paste a new refresh token.

---

## When you *would* need to authenticate again

You only need to re-do the Google login / paste a new refresh token if:

- You remove `GOOGLE_REFRESH_TOKEN` from Vercel / `.env.local`  
- You revoke app access in your Google Account (Security → Third-party access)  
- Google invalidates the refresh token (rare; sometimes after long unused, password change, or app in “Testing” mode with expired test users)  
- Client ID / secret change and the old refresh token no longer matches  

If APIs start returning 401/503 “authentication not configured” or refresh fails in logs, run the one-time `/auth` flow again and update `GOOGLE_REFRESH_TOKEN`.

---

## Related files

| File | Role |
|------|------|
| `lib/google-auth-server.ts` | Auto-refresh access token from `GOOGLE_REFRESH_TOKEN` |
| `app/auth/callback/page.tsx` | One-time OAuth callback (stores tokens) |
| `app/api/auth/token/route.ts` | Exchanges auth `code` for access + refresh tokens |
| `app/api/auth/refresh/route.ts` | Optional client-side refresh helper |
| `env.example` | Lists the env vars you need |

---

## Mental model

> **Access token** = temporary key to the door (expires hourly).  
> **Refresh token** = master key kept in the server vault.  
> The server uses the master key to cut a new temporary key whenever needed — so you don’t have to walk to Google’s front desk every time you open the software.
