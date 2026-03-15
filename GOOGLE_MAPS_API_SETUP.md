# 🗺️ Google Maps API Setup Guide

## Current Issue

The location details page shows: **"Google Maps Platform rejected your request. The provided API key is invalid."**

This happens because the Google Maps embed requires a valid API key.

---

## Quick Fix (No API Key Needed)

I've updated the code to show a fallback when no API key is set. The map will show a placeholder with a link to Google Maps instead.

---

## Option 1: Get Google Maps API Key (Recommended)

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project: "LotusFX Business Insights App" (or create one)

### Step 2: Enable Maps JavaScript API

1. Go to **APIs & Services** → **Library**
2. Search for: **Maps JavaScript API**
3. Click **Enable**

### Step 3: Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy your API key

### Step 4: Restrict API Key (Important for Security)

1. Click on your newly created API Key
2. Under **API restrictions**, select **Restrict key**
3. Check: **Maps JavaScript API** and **Maps Embed API**
4. Under **Application restrictions**:
   - For production: Add your website domain (e.g., `lotusfx.com`)
   - For local testing: Add `localhost:8004`
5. Click **Save**

### Step 5: Add to Environment Variables

Add to your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key_here
```

### Step 6: Restart Server

```bash
# Stop (Ctrl+C) and restart
npm run dev
```

---

## Option 2: Use Static Map (No API Key for Basic)

You can also use Google Static Maps API which has a free tier:

1. Enable **Maps Static API** in Google Cloud Console
2. Add the API key to `.env.local`
3. Update the code to use static map images

---

## Current Implementation

The code now:
- ✅ Shows embedded map if API key is available
- ✅ Shows fallback placeholder if no API key
- ✅ Always has "Open in Google Maps" button (works without API key)

---

## Cost Information

**Google Maps APIs:**
- **Maps JavaScript API**: Free up to $200/month credit
- **Maps Embed API**: Free (unlimited)
- **Static Maps API**: Free up to $200/month credit

For most websites, you'll stay within the free tier.

---

## For Production

When deploying to `lotusfx.com`:

1. Add API key to production environment variables
2. Update API key restrictions to include `lotusfx.com`
3. The embedded map will work automatically

---

## Quick Test

After adding the API key:
1. Restart server
2. Visit a location details page
3. Map should load without errors ✅

---

**Need help?** The fallback will work fine for now - users can still click "Open in Google Maps" to get directions!
