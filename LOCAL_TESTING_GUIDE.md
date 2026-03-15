# 🧪 Local Testing Guide

## Step-by-Step Local Testing

### Step 1: Get Your Tokens (One-Time Setup)

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Visit the locations page:**
   ```
   http://localhost:3000/locations
   ```

3. **Authenticate with Google:**
   - You'll be redirected to Google OAuth
   - Complete authentication
   - You'll be redirected back with tokens

4. **Extract tokens from browser:**
   - Open browser DevTools (F12)
   - Go to Application/Storage → Local Storage
   - Find these keys:
     - `google_access_token`
     - `google_refresh_token`
     - `google_token_expiry`

5. **Copy the values** - you'll need them for Step 2

---

### Step 2: Set Up Local Environment Variables

1. **Create/Update `.env.local` file** in the root directory:

```env
# Google OAuth (should already exist)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Server-side tokens (NEW - add these)
GOOGLE_ACCESS_TOKEN=paste_your_access_token_here
GOOGLE_REFRESH_TOKEN=paste_your_refresh_token_here
GOOGLE_TOKEN_EXPIRY=paste_your_expiry_timestamp_here

# Site URL (for local testing)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

2. **Calculate expiry timestamp:**
   - If you have `expires_in` (seconds), calculate: `Date.now() + (expires_in * 1000)`
   - Or use the `google_token_expiry` value from localStorage
   - Or set it to a future timestamp (e.g., 1 hour from now)

3. **Restart your dev server** after adding env vars:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

### Step 3: Test Token Status

1. **Visit token status endpoint:**
   ```
   http://localhost:3000/api/admin/token-status
   ```

2. **Expected response:**
   ```json
   {
     "configured": true,
     "accessToken": "***configured***",
     "refreshToken": "***configured***",
     "expiryDate": "1234567890",
     "isExpired": false,
     "expiresIn": "45 minutes (0 hours)",
     "tokenValid": true,
     "status": "valid"
   }
   ```

3. **If not configured:**
   - Check your `.env.local` file
   - Make sure you restarted the server
   - Verify token values are correct

---

### Step 4: Test Cache Refresh

1. **Manually refresh cache:**
   - Use Postman, curl, or browser extension
   - Or create a test page (see below)

2. **Using curl:**
   ```bash
   curl -X POST http://localhost:3000/api/admin/refresh-cache
   ```

3. **Expected response:**
   ```json
   {
     "success": true,
     "message": "Cache refreshed successfully. 54 locations loaded.",
     "locationsCount": 54,
     "cached": false,
     "timestamp": 1234567890
   }
   ```

---

### Step 5: Test Cached Endpoint (Public)

1. **Visit cached endpoint:**
   ```
   http://localhost:3000/api/locations/cached
   ```

2. **Expected response:**
   ```json
   {
     "locations": [...],
     "cached": true,
     "timestamp": 1234567890
   }
   ```

3. **Test with country filter:**
   ```
   http://localhost:3000/api/locations/cached?country=AU
   ```

---

### Step 6: Test Frontend (Locations Page)

1. **Visit locations page:**
   ```
   http://localhost:3000/locations
   ```

2. **Expected behavior:**
   - ✅ No authentication prompt
   - ✅ Locations load automatically
   - ✅ Country filter works
   - ✅ Fast loading (from cache)

3. **Check browser console:**
   - Should see: "Fetching locations from cached endpoint..."
   - Should see: "Successfully fetched X locations (from cache)"

---

### Step 7: Test Background Job (Optional)

1. **Run the background job script:**
   ```bash
   node scripts/update-locations-cache.js
   ```

2. **Expected output:**
   ```
   [2024-01-15T10:00:00.000Z] Starting cache update...
   [2024-01-15T10:00:01.000Z] Cache updated successfully:
     - Locations: 54
     - Cached: false
     - Timestamp: 2024-01-15T10:00:01.000Z
   Cache update completed
   ```

---

## Quick Test Script

I'll create a test page you can use to test everything at once.

---

## Troubleshooting

### Issue: "Server authentication not configured"
**Solution:** 
- Check `.env.local` has `GOOGLE_ACCESS_TOKEN` and `GOOGLE_REFRESH_TOKEN`
- Restart dev server after adding env vars

### Issue: "Token expired"
**Solution:**
- The system should auto-refresh
- If not, update `GOOGLE_TOKEN_EXPIRY` to a future timestamp
- Or re-authenticate and get new tokens

### Issue: Cache not working
**Solution:**
- Check server logs for errors
- Manually trigger cache refresh
- Verify tokens are valid

### Issue: Locations not loading
**Solution:**
- Check browser console for errors
- Verify `/api/locations/cached` returns data
- Check token status endpoint

---

## Test Checklist

- [ ] Environment variables set in `.env.local`
- [ ] Dev server restarted
- [ ] Token status shows "valid"
- [ ] Cache refresh works
- [ ] Cached endpoint returns locations
- [ ] Frontend loads locations without auth
- [ ] Country filter works
- [ ] Background job runs successfully

---

## Next Steps

Once all tests pass:
1. ✅ Everything works locally
2. 📝 Review `DEPLOYMENT_CHECKLIST.md`
3. 🚀 Deploy to production
4. 🔧 Set environment variables on production server
5. ✅ Verify production works

---

Ready to test? Let's start! 🧪
