# 🚀 Production Deployment Checklist

## Pre-Deployment Setup

### 1. Initial Admin Authentication (One-Time)

**Step 1:** Visit your development site and authenticate:
1. Go to `/locations` page
2. Complete Google OAuth flow
3. Get your tokens from browser console or network tab

**Step 2:** Extract tokens:
- `access_token` → `GOOGLE_ACCESS_TOKEN`
- `refresh_token` → `GOOGLE_REFRESH_TOKEN`
- Calculate `expiry_date` → `GOOGLE_TOKEN_EXPIRY`

**Step 3:** Set environment variables on production server:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_ACCESS_TOKEN=your_access_token
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_TOKEN_EXPIRY=expiry_timestamp
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Deployment Steps

### ✅ Step 1: Environment Variables
- [ ] Set all environment variables on production server
- [ ] Verify `GOOGLE_ACCESS_TOKEN` and `GOOGLE_REFRESH_TOKEN` are set
- [ ] Verify `NEXT_PUBLIC_SITE_URL` matches your domain

### ✅ Step 2: Test Token Status
- [ ] Visit `/api/admin/token-status` (or check via API)
- [ ] Verify tokens are valid
- [ ] Check expiry time

### ✅ Step 3: Test Cache Refresh
- [ ] Visit `/api/admin/refresh-cache` (POST request)
- [ ] Verify cache is populated
- [ ] Check `/api/locations/cached` returns data

### ✅ Step 4: Set Up Background Job

**For Vercel:**
- [ ] `vercel.json` is configured (already done)
- [ ] Cron job will run automatically every 30 minutes

**For Other Hosting:**
- [ ] Set up cron job or scheduled task
- [ ] Point to `/api/admin/refresh-cache` endpoint
- [ ] Schedule: Every 30 minutes (`*/30 * * * *`)

**Alternative Options:**
- [ ] Use external cron service (cron-job.org)
- [ ] Use GitHub Actions scheduled workflow
- [ ] Use node-cron in your server

### ✅ Step 5: Test Public Access
- [ ] Visit `/locations` page (no authentication should be required)
- [ ] Verify locations load correctly
- [ ] Test country filtering
- [ ] Check location details pages

### ✅ Step 6: Monitor
- [ ] Check logs for cache updates
- [ ] Monitor API rate limits
- [ ] Set up error alerts
- [ ] Verify background job is running

---

## Post-Deployment Verification

### Quick Tests:

1. **Public Access:**
   ```
   Visit: https://yourdomain.com/locations
   Expected: Locations load without authentication
   ```

2. **Cache Status:**
   ```
   GET: https://yourdomain.com/api/locations/cached
   Expected: Returns locations with cached: true/false
   ```

3. **Token Status:**
   ```
   GET: https://yourdomain.com/api/admin/token-status
   Expected: Shows token status and expiry
   ```

4. **Manual Cache Refresh:**
   ```
   POST: https://yourdomain.com/api/admin/refresh-cache
   Expected: Returns success with location count
   ```

---

## Troubleshooting

### Issue: "Server authentication not configured"
**Solution:** Set `GOOGLE_ACCESS_TOKEN` and `GOOGLE_REFRESH_TOKEN` in environment variables

### Issue: "Token expired"
**Solution:** The system should auto-refresh. If not, manually update tokens:
1. Re-authenticate in development
2. Get new tokens
3. Update environment variables

### Issue: Cache not updating
**Solution:** 
1. Check background job is running
2. Manually trigger: `POST /api/admin/refresh-cache`
3. Check server logs for errors

### Issue: Rate limit errors
**Solution:**
1. Increase cache TTL (currently 30 minutes)
2. Reduce background job frequency
3. Check for excessive API calls

---

## Security Notes

⚠️ **Important:**
- Never commit tokens to Git
- Use environment variables only
- Add authentication to admin endpoints in production
- Monitor for unauthorized access

**To add authentication to admin endpoints:**
1. Generate a secret: `openssl rand -base64 32`
2. Add to env: `ADMIN_SECRET=your_secret`
3. Uncomment auth checks in:
   - `/api/admin/refresh-cache/route.ts`
   - `/api/admin/token-status/route.ts`

---

## Maintenance

### Monthly:
- [ ] Check token expiry status
- [ ] Review API usage
- [ ] Verify cache is updating

### Quarterly:
- [ ] Rotate refresh tokens (re-authenticate)
- [ ] Review and update environment variables
- [ ] Check for Google API changes

---

## Support

If you encounter issues:
1. Check server logs
2. Verify environment variables
3. Test token status endpoint
4. Check background job logs
5. Review Google API quota/limits

---

## Success Criteria

✅ Public users can access locations without authentication  
✅ Locations load quickly (from cache)  
✅ Cache updates automatically every 30 minutes  
✅ Tokens refresh automatically when expired  
✅ No manual intervention needed  
✅ Handles high traffic (cached responses)  

---

**Ready to deploy?** Follow the checklist above and you're good to go! 🚀
