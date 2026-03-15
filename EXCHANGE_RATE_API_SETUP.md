# 💱 Exchange Rate API Setup Guide

## Overview

The calculator now uses a real API endpoint to fetch live exchange rates from your server.

---

## 🔧 Setup Steps

### 1. Get Your API URL

Your developer provided:
```
POST http://xxx.xxxx.com/rst/Currencies/getExchangeRate
```

**Replace `xxx.xxxx.com` with your actual API server URL.**

### 2. Add to Environment Variables

Add this to your `.env.local` file:

```env
EXCHANGE_RATE_API_URL=http://your-actual-api-url.com/rst/Currencies/getExchangeRate
```

**Example:**
```env
EXCHANGE_RATE_API_URL=https://api.lotusfx.com/rst/Currencies/getExchangeRate
```

### 3. Restart Server

After adding the environment variable, restart your Next.js server:

```bash
npm run dev
```

---

## 🧪 Testing the API

### Option 1: Use Test Page

1. Go to: `http://localhost:8004/test-calculator`
2. Enter test values:
   - From Currency: `NZD`
   - To Currency: `AUD`
   - To Amount: `100`
   - Transfer Mode: `eWire`
3. Click "Test API"
4. Check the response

### Option 2: Test with Calculator

1. Go to homepage or currency exchange page
2. Use the calculator
3. Check browser console for API calls
4. If API fails, it will fallback to estimated rates

---

## 📋 API Request Format

The API expects:

**Endpoint:** `POST /api/exchange-rate`

**Body:**
```json
{
  "fromCcy": "NZD",
  "toCcy": "AUD",
  "toAmount": 100,
  "transferMode": "eWire",  // Optional: Wire/eWire/Booking/Wallet
  "isBuy": false,           // Optional: boolean
  "promoGroup": "",         // Optional: string
  "customerID": ""          // Optional: string
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    // Your API response structure here
    // Expected fields: rate, convertedAmount, fromAmount, etc.
  }
}
```

---

## 🔍 Troubleshooting

### Issue: "Failed to fetch exchange rate"

**Possible causes:**
1. API URL not set in `.env.local`
2. API server is down
3. CORS issues (if API doesn't allow requests from your domain)
4. Invalid API credentials

**Solutions:**
- Check `.env.local` has `EXCHANGE_RATE_API_URL` set
- Test API directly with Postman/curl
- Check server logs for errors
- Calculator will fallback to estimated rates if API fails

### Issue: "Unexpected API response format"

**Solution:**
- Check the actual API response structure
- Update `CurrencyCalculator.tsx` to match your API's response format
- Look for fields like: `rate`, `convertedAmount`, `fromAmount`, `exchangeRate`

---

## 📝 Next Steps

1. **Get the actual API URL** from your developer
2. **Add it to `.env.local`**
3. **Test using `/test-calculator` page**
4. **Verify the response structure** matches what the calculator expects
5. **Update response parsing** in `CurrencyCalculator.tsx` if needed

---

## 🔄 Response Format Adjustment

If your API returns a different structure, update this section in `CurrencyCalculator.tsx`:

```typescript
// Current parsing (adjust based on your API):
const converted = apiData.fromAmount || apiData.convertedAmount || apiData.amount
const exchangeRate = apiData.rate || apiData.exchangeRate || (converted / fromAmount)
```

**Common API response formats:**
- `{ rate: 1.08, fromAmount: 100, toAmount: 108 }`
- `{ exchangeRate: 1.08, convertedAmount: 108 }`
- `{ rate: 1.08, amount: 108 }`

---

## ✅ Checklist

- [ ] API URL obtained from developer
- [ ] `EXCHANGE_RATE_API_URL` added to `.env.local`
- [ ] Server restarted
- [ ] Test page (`/test-calculator`) works
- [ ] Calculator shows real rates
- [ ] Response format matches expectations

---

**Need help?** Check the browser console for detailed error messages!
