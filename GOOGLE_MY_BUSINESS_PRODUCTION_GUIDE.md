# 🔐 Google My Business API - Production Guide

## 📊 Current Implementation Status

### ✅ What's Working:
- OAuth 2.0 authentication flow
- Token storage in localStorage (client-side)
- Fetching locations from Google My Business API
- Country-based filtering (AU, NZ, FJ)
- Location details with hours, phone, address

### ⚠️ Current Limitations (Development Mode):
- **Token stored in localStorage** - Not secure for production
- **No automatic token refresh** - Users must re-authenticate when token expires
- **No server-side token storage** - Each user authenticates separately
- **No caching** - Every page load fetches from Google API

---

## 💰 API Credits & Limits

### **Google My Business API Quotas:**

1. **Free Tier (Default):**
   - **No cost** - Google My Business API is free to use
   - **No per-request charges** - Unlike some Google APIs, this one doesn't charge per call

2. **Rate Limits:**
   - **Queries per minute (QPM):** 60 requests per minute per user
   - **Queries per day (QPD):** 1,000 requests per day per user
   - **Concurrent requests:** Limited to prevent abuse

3. **What Counts as a Request:**
   - Each API call to fetch locations = 1 request
   - Fetching account list = 1 request
   - Fetching location details = 1 request per location
   - **Pagination:** Each page = 1 request

4. **Your Current Usage:**
   - **3 accounts** (AU, NZ, FJ)
   - **~54 locations total** (20 AU + 18 NZ + 16 FJ)
   - **Initial load:** ~3-4 requests (accounts + locations with pagination)
   - **Per user visit:** ~3-4 API calls

### **Cost Analysis:**
- ✅ **$0 cost** - No charges for Google My Business API
- ⚠️ **Rate limit risk** - If you have 100+ concurrent users, you might hit the 60 QPM limit
- 💡 **Solution:** Implement caching (see below)

---

## 🚀 Making It Production-Ready

### **Problem 1: Token Expiration**
**Current Issue:** Access tokens expire after 1 hour. Users must re-authenticate.

**Solution:** Implement automatic token refresh using refresh tokens.

### **Problem 2: Security**
**Current Issue:** Tokens stored in localStorage (client-side) are vulnerable.

**Solution:** Store tokens server-side in a secure database or environment variables.

### **Problem 3: Multiple User Authentication**
**Current Issue:** Each visitor must authenticate with Google.

**Solution:** Use a service account or single admin authentication that serves all users.

### **Problem 4: API Rate Limits**
**Current Issue:** Every page load = API calls = potential rate limit hits.

**Solution:** Implement caching (see below).

---

## 🔧 Production Setup Options

### **Option 1: Service Account (Recommended for Public Websites)**

**Best for:** Public websites where you don't want users to authenticate

**How it works:**
1. Create a Google Service Account in Google Cloud Console
2. Grant it access to your Google My Business account
3. Use service account credentials (JSON key file) instead of OAuth
4. No user authentication needed
5. Tokens are managed automatically by Google's client library

**Pros:**
- ✅ No user authentication required
- ✅ Automatic token management
- ✅ More secure (credentials on server only)
- ✅ Works for all visitors

**Cons:**
- ⚠️ Requires Google Workspace account setup
- ⚠️ More complex initial setup

---

### **Option 2: Single Admin Authentication + Caching (Current + Improvements)**

**Best for:** Quick production deployment with minimal changes

**How it works:**
1. Admin authenticates once (you)
2. Store refresh token securely on server
3. Automatically refresh access token when needed
4. Cache location data (update every 30-60 minutes)
5. All users see cached data (no authentication needed)

**Pros:**
- ✅ Quick to implement
- ✅ No user authentication
- ✅ Reduces API calls significantly
- ✅ Faster page loads

**Cons:**
- ⚠️ Data updates every 30-60 minutes (not real-time)
- ⚠️ Requires server-side storage

---

### **Option 3: Hybrid Approach (Best of Both)**

**How it works:**
1. Use service account or admin authentication for backend
2. Cache location data in database/Redis
3. Update cache every 30 minutes via background job
4. Serve cached data to users (fast, no API calls)
5. Admin can manually refresh cache if needed

**Pros:**
- ✅ Fast for users (cached data)
- ✅ Low API usage (only background updates)
- ✅ Real-time updates possible (admin-triggered)
- ✅ Scalable (handles thousands of users)

**Cons:**
- ⚠️ Requires database/cache setup
- ⚠️ Slightly more complex

---

## 📝 Implementation Steps

### **Step 1: Create Token Refresh API Endpoint**

Create `/api/auth/refresh/route.ts` to automatically refresh tokens.

### **Step 2: Implement Server-Side Token Storage**

Store tokens in:
- **Environment variables** (for single admin)
- **Database** (for multiple admins)
- **Secure file** (for development)

### **Step 3: Add Caching Layer**

Cache location data:
- **In-memory cache** (Redis/Memcached) - 30-60 minute TTL
- **Database cache** - Update via background job
- **Next.js ISR** - Static regeneration every 30 minutes

### **Step 4: Background Job for Cache Updates**

Set up a cron job or scheduled task to:
- Refresh access token if needed
- Fetch latest locations from Google API
- Update cache with new data

---

## 🎯 Recommended Production Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js App    │
│  (Frontend)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  API Route      │─────▶│   Cache      │
│  /api/locations │      │  (Redis/DB)  │
└────────┬────────┘      └──────────────┘
         │
         │ Cache Miss
         ▼
┌─────────────────┐      ┌──────────────┐
│  Token Manager  │─────▶│  Google API  │
│  (Auto Refresh)  │      │              │
└─────────────────┘      └──────────────┘
         │
         │ Background Job (Every 30 min)
         ▼
┌─────────────────┐
│  Cache Updater  │
└─────────────────┘
```

---

## 🔄 Token Refresh Flow

### **Current Flow (Development):**
1. User visits `/locations`
2. Check localStorage for token
3. If no token → Redirect to Google OAuth
4. If token exists → Use it (may be expired)
5. If expired → User must re-authenticate ❌

### **Production Flow (Recommended):**
1. Background job runs every 30 minutes
2. Check if access token is expired (or expiring soon)
3. If expired → Use refresh token to get new access token
4. Fetch latest locations from Google API
5. Update cache with new data
6. User visits `/locations` → Gets cached data (fast, no API call) ✅

---

## 📋 Next Steps Checklist

- [ ] Create token refresh API endpoint
- [ ] Implement server-side token storage
- [ ] Add caching layer (Redis or database)
- [ ] Set up background job for cache updates
- [ ] Update frontend to use cached data
- [ ] Add admin panel to manually refresh cache
- [ ] Monitor API usage and rate limits
- [ ] Set up error alerts for token failures

---

## 🛠️ Quick Fix: Add Token Refresh Now

I'll create a token refresh API endpoint that you can use immediately. This will:
- ✅ Automatically refresh expired tokens
- ✅ Work with your current setup
- ✅ Reduce authentication prompts

**See:** `/api/auth/refresh/route.ts` (will be created)

---

## 📞 Questions?

**Q: Will I be charged for API calls?**
A: No, Google My Business API is free. No per-request charges.

**Q: What happens if I hit rate limits?**
A: API will return 429 (Too Many Requests). Implement caching to avoid this.

**Q: How often should I update the cache?**
A: Every 30-60 minutes is sufficient. Business hours don't change that often.

**Q: Can I use a service account?**
A: Yes, but requires Google Workspace setup. Single admin + caching is easier.

**Q: What if my refresh token expires?**
A: Refresh tokens can expire if unused for 6 months. Re-authenticate if needed.

---

## 🔒 Security Best Practices

1. **Never expose client secret** - Keep it server-side only
2. **Use HTTPS** - Always use secure connections
3. **Rotate tokens** - Periodically refresh tokens
4. **Monitor usage** - Watch for unusual API activity
5. **Limit access** - Only grant necessary permissions
