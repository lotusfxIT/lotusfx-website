# 🔄 How to Get Refresh Token

## Problem
Your refresh token is `undefined` - this means it wasn't stored during authentication.

## Solution: Re-authenticate with `prompt=consent`

The refresh token is only provided when you explicitly consent. Let's fix this:

### Step 1: Clear Current Tokens

1. Open browser DevTools (F12)
2. Go to: Application → Local Storage → `http://localhost:8004`
3. Delete these keys:
   - `google_access_token`
   - `google_refresh_token`
   - `google_token_expiry`

### Step 2: Re-authenticate

1. Visit: `http://localhost:8004/locations`
2. You'll be redirected to Google OAuth
3. **Important:** Make sure to check "Allow access" or grant all permissions
4. Complete authentication

### Step 3: Check for Refresh Token

After authentication, check localStorage again:
- `google_refresh_token` should now have a value (long string starting with `1//`)

### Alternative: Force Consent

If refresh token is still missing, we need to modify the OAuth flow to force consent.

---

## Quick Fix: Update OAuth Flow

The issue might be that `prompt=select_account` doesn't always return refresh token. We need `prompt=consent` for the first time.

Let me update the component to ensure we get refresh token.
