# 🚀 Production Setup Guide - Google My Business API

## 🎯 Best Approach for Public Website

For a **public website** where users shouldn't need to authenticate, here's the recommended architecture:

### **Recommended: Single Admin Auth + Server-Side Caching**

**How it works:**
1. **Admin authenticates once** (you) - Store tokens server-side
2. **Background job** refreshes tokens automatically
3. **Cache location data** - Update every 30-60 minutes
4. **Users get cached data** - Fast, no API calls, no authentication

---

## 📋 Implementation Plan

### **Phase 1: Server-Side Token Management** ✅
- Store tokens in environment variables (for single admin)
- Automatic token refresh on server
- No client-side token storage

### **Phase 2: Caching Layer** ✅
- Cache location data in memory or database
- 30-60 minute cache TTL
- Fast responses for users

### **Phase 3: Background Updates** ✅
- Scheduled job to update cache
- Automatic token refresh
- No downtime

### **Phase 4: Admin Panel** (Optional)
- Manual cache refresh button
- Token status monitoring
- API usage stats

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Public Users                         │
│  (No authentication needed)                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Route                          │
│         /api/locations (Public)                        │
│  Returns cached data instantly                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Cache Layer                                 │
│  - In-memory cache (Redis/Memcached)                    │
│  - OR Database cache                                     │
│  - OR Next.js ISR (Static Regeneration)                │
│  TTL: 30-60 minutes                                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ Cache Miss / Expired
                   ▼
┌─────────────────────────────────────────────────────────┐
│         Background Job (Cron/Scheduled)                │
│  Runs every 30 minutes:                                 │
│  1. Check token expiry                                  │
│  2. Refresh if needed                                   │
│  3. Fetch latest locations from Google API              │
│  4. Update cache                                        │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Google My Business API                     │
│  - Uses server-side tokens                              │
│  - Auto-refreshes when needed                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Steps

### **Step 1: Environment Variables Setup**

Add to your production `.env` file:

```env
# Google OAuth (for initial admin authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Server-side token storage (set after first auth)
GOOGLE_ACCESS_TOKEN=your_access_token
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_TOKEN_EXPIRY=expiry_timestamp

# Optional: Redis for caching
REDIS_URL=your_redis_url
```

### **Step 2: Server-Side Token Management**

Create API routes that:
- Read tokens from environment variables (not localStorage)
- Automatically refresh when expired
- Never expose tokens to client

### **Step 3: Caching Implementation**

Choose one:

**Option A: Next.js ISR (Simplest)**
- Use `revalidate` in API routes
- Next.js handles caching automatically
- Good for Vercel deployment

**Option B: In-Memory Cache**
- Use Node.js Map or Redis
- Fast, but lost on server restart
- Good for single server

**Option C: Database Cache**
- Store in PostgreSQL/MongoDB
- Persistent across restarts
- Good for multiple servers

### **Step 4: Background Job**

**For Vercel:**
- Use Vercel Cron Jobs
- Runs on schedule

**For Other Hosting:**
- Use node-cron library
- Or external cron service (cron-job.org)
- Or GitHub Actions scheduled workflows

---

## 📝 Files to Create/Update

1. ✅ `/api/locations/cached` - Public endpoint with caching
2. ✅ `/api/admin/refresh-cache` - Admin endpoint to refresh cache
3. ✅ `/api/admin/token-status` - Check token status
4. ✅ Background job script
5. ✅ Update frontend to use cached endpoint

---

## 🎯 Benefits of This Approach

✅ **No user authentication** - Public site works for everyone  
✅ **Fast responses** - Cached data, no API delays  
✅ **Low API usage** - Only background updates, not per-user  
✅ **Automatic token refresh** - No manual intervention  
✅ **Scalable** - Handles thousands of concurrent users  
✅ **Cost-effective** - Minimal API calls  

---

## ⚠️ Important Notes

1. **Initial Setup:**
   - Admin must authenticate once to get tokens
   - Store tokens in environment variables
   - Set up background job

2. **Token Security:**
   - Never commit tokens to Git
   - Use environment variables only
   - Rotate tokens periodically

3. **Cache Strategy:**
   - 30-60 minute TTL is usually sufficient
   - Business hours don't change frequently
   - Can manually refresh if needed

4. **Monitoring:**
   - Watch for token expiry errors
   - Monitor API rate limits
   - Check cache hit rates

---

## 🚀 Deployment Checklist

Before going live:

- [ ] Set environment variables on production server
- [ ] Admin authenticates once (get tokens)
- [ ] Store tokens in production env vars
- [ ] Set up background job/cron
- [ ] Test cache refresh
- [ ] Test token auto-refresh
- [ ] Monitor API usage
- [ ] Set up error alerts

---

## 📞 Next Steps

I'll create the implementation files:
1. Cached locations API endpoint
2. Server-side token management
3. Background job setup
4. Admin refresh endpoint
5. Updated frontend component

Ready to implement? Let me know and I'll create all the necessary files!
