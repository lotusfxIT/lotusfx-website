# Deploy, domain & subdomains

## 1. Google OAuth in production (long-lived tokens)

- **Access tokens** always expire (~1 hour). The app now refreshes them automatically using **GOOGLE_REFRESH_TOKEN** (no re-auth every hour).
- **Refresh tokens**:
  - If the OAuth app is in **Testing** (Google Cloud Console → APIs & Services → OAuth consent screen), refresh tokens can expire (e.g. after 7 days or when test user count limits apply).
  - For **production**: set the OAuth consent screen to **Production** so refresh tokens stay valid long-term. You don’t have to complete full “verification” for your own use (single Google account / server-only).
- **What to do**:
  1. Google Cloud Console → your project → **APIs & Services** → **OAuth consent screen**.
  2. Set **Publishing status** to **Production** (or keep Testing and re-run the auth flow occasionally if you’re fine with that).
  3. If you use sensitive/restricted scopes and want many users, follow [Google’s verification process](https://developers.google.com/identity/protocols/oauth2/production-readiness).
  4. Keep **GOOGLE_REFRESH_TOKEN** in your server env (from the one-time `/auth` flow). The server will keep getting new access tokens from it.

---

## 2. Hosting (not tied to Vercel)

You can host anywhere that runs Node (Vercel, AWS, your own server, etc.).

### Option A: Vercel (recommended for simplicity)

1. Push the repo to Git and connect it in [Vercel](https://vercel.com), or run `npx vercel` and follow the prompts.
2. In the project dashboard, set **Environment variables** (Production/Preview as needed):
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - **`GOOGLE_REFRESH_TOKEN`** (from the one-time `/auth` flow)
   - Optional: `GOOGLE_ACCESS_TOKEN`, `GOOGLE_TOKEN_EXPIRY` (fallback; server refreshes from refresh token)
   - `NEXT_PUBLIC_SITE_URL` = your live URL (e.g. `https://lotusfx.com` or `https://your-app.vercel.app`)
3. Redeploy after changing env vars.

### Option B: Other hosts

- Build: `npm run build` (or `yarn build`).
- Run: `npm run start` (or `yarn start`) with Node.
- Set the same env vars in the host’s dashboard or runtime config.

---

## 3. Custom domain and subdomains (e.g. lotusfx.com)

### DNS (at your domain registrar or DNS provider)

Point the root and subdomains to your host. Example for **Vercel**:

| Type  | Name | Value / Target        | TTL (optional) |
|-------|------|------------------------|----------------|
| CNAME | au   | `cname.vercel-dns.com` | 3600           |
| CNAME | fj   | `cname.vercel-dns.com` | 3600           |
| CNAME | nz   | `cname.vercel-dns.com` | 3600           |
| A     | @    | `76.76.21.21`          | 3600           |

- **Subdomains** `au`, `fj`, `nz`: CNAME to `cname.vercel-dns.com` (so you get `au.lotusfx.com`, `fj.lotusfx.com`, `nz.lotusfx.com`).
- **Root** `lotusfx.com`: Vercel usually asks you to add either an A record to `76.76.21.21` or a CNAME to `cname.vercel-dns.com` (they’ll show the exact value in the Vercel dashboard).

Vercel’s docs: [Add a domain](https://vercel.com/docs/projects/domains).

### In Vercel (or your host)

1. Project → **Settings** → **Domains**.
2. Add:
   - `lotusfx.com`
   - `au.lotusfx.com`
   - `fj.lotusfx.com`
   - `nz.lotusfx.com`
3. Follow the instructions to verify (DNS records above). SSL is automatic once DNS is correct.

### How the app uses subdomains

- **au.lotusfx.com** → Australia (AU)
- **fj.lotusfx.com** → Fiji (FJ)
- **nz.lotusfx.com** → New Zealand (NZ)
- **lotusfx.com** → Default to New Zealand (NZ)

The app’s middleware reads the hostname and sets a cookie so the site shows the right country. No redirect from `lotusfx.com` to `nz.lotusfx.com` unless you add one; the root domain just behaves as NZ.

---

## 4. Testing with stafflotusfx.com (before going live on lotusfx.com)

Use **stafflotusfx.com** and subdomains first. Same app; middleware already maps them.

### 4a. Vercel – environment variable

1. Vercel → your project → **Settings** → **Environment Variables**.
2. Add or edit:
   - **Key:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://stafflotusfx.com`
   - **Environments:** Production (and Preview if you use it).
3. Save, then **Deployments** → … on latest → **Redeploy**.

### 4b. Vercel – domains

In **Settings** → **Domains**, add:

- `stafflotusfx.com`
- `au.stafflotusfx.com`
- `nz.stafflotusfx.com`
- `fj.stafflotusfx.com`

Add the DNS records Vercel shows at your DNS provider for **stafflotusfx.com** (CNAME for `au`, `nz`, `fj`, and A or CNAME for root).

### 4c. Google OAuth – authorized origins and redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → your project → **APIs & Services** → **Credentials**.
2. Open your **OAuth 2.0 Client ID** (Web application).
3. Under **Authorized JavaScript origins**, add (one per line or paste all):
   ```
   https://stafflotusfx.com
   https://au.stafflotusfx.com
   https://nz.stafflotusfx.com
   https://fj.stafflotusfx.com
   ```
4. Under **Authorized redirect URIs**, add:
   ```
   https://stafflotusfx.com/auth/callback
   https://au.stafflotusfx.com/auth/callback
   https://nz.stafflotusfx.com/auth/callback
   https://fj.stafflotusfx.com/auth/callback
   ```
5. Click **Save**.

When you switch to production, add the same for `lotusfx.com`, `au.lotusfx.com`, `nz.lotusfx.com`, `fj.lotusfx.com` (and keep or remove stafflotusfx.com as you prefer).

---

## 5. Audit URL

After deploy, share your live URL for audit, e.g.:

- `https://lotusfx.com`
- or `https://nz.lotusfx.com`, `https://au.lotusfx.com`, etc.

Location details keep working without hourly re-auth because the server uses **GOOGLE_REFRESH_TOKEN** to refresh the access token when it expires.
