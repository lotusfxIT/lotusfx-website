# 🔐 Exchange Rate API Authentication Setup

## Current Status

The API at `https://nzcportal.lotusfx.com/rst/Currencies/getExchangeRate` requires authentication.

**Error received:** `Unauthorized: Authentication is required and has failed or has not yet been provided.`

---

## 🔑 Authentication Method

**Found it!** Based on your old website code, the API uses:

### ✅ API Key via `x-api-key` Header
- Header: `x-api-key: {your_api_key}`
- This is what your old website used (see `SimpleApiAuthentication.php`)

The code is now configured to use this method.

### Option 2: Bearer Token
- Header: `Authorization: Bearer {token}`
- OAuth-style authentication

### Option 3: Basic Auth (Username/Password)
- Header: `Authorization: Basic {base64(username:password)}`
- Traditional HTTP basic authentication

---

## 📋 What You Need to Do

### Step 1: Get the API Key

**Ask your developer:**
1. What is the API key value for `https://nzcportal.lotusfx.com`?
2. Where can I find it? (Is it in `.env` file? Database? Config?)

The API uses `x-api-key` header (confirmed from your old website code).

---

## ⚙️ Configuration

Once you have the API key, add it to `.env.local`:

```env
EXCHANGE_RATE_API_URL=https://nzcportal.lotusfx.com/rst/Currencies/getExchangeRate
EXCHANGE_RATE_API_KEY=your_actual_api_key_here
```

**That's it!** The code will automatically send it in the `x-api-key` header.

---

## 🧪 Testing

After adding credentials:

1. **Restart server:**
   ```bash
   npm run dev
   ```

2. **Test using test page:**
   - Go to: `http://localhost:8004/test-calculator`
   - Try a request
   - Check browser console for errors

3. **Check server logs:**
   - Look for `[Exchange Rate API]` messages
   - See if authentication is being sent

---

## 🔍 Debugging

If it still doesn't work:

1. **Check server console** for:
   ```
   [Exchange Rate API] Request: { url: ..., hasAuth: true/false }
   ```

2. **Check the actual error** in the test page response

3. **Try different authentication methods:**
   - The code tries API Key first, then Token, then Basic Auth
   - You can comment out unused methods in `.env.local`

---

## 📝 Example API Request

The code sends:
```http
POST https://nzcportal.lotusfx.com/rst/Currencies/getExchangeRate
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN (or other auth method)

[
  {
    "fromCcy": "NZD",
    "toCcy": "AUD",
    "toAmount": 100
  }
]
```

---

## ✅ Next Steps

1. **Get authentication details from your developer**
2. **Add credentials to `.env.local`**
3. **Restart server**
4. **Test using `/test-calculator` page**
5. **If it works, the calculator will automatically use real rates!**

---

**Need help?** Share the authentication method and credentials (or ask your developer), and I'll help you configure it!
