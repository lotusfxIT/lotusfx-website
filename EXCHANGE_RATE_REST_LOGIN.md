# 🔐 Exchange Rate API - REST Login Setup

## Current Issue

The API returns: `{"__ERROR":[{"message":"REST login failed","componentSignature":"dbmg","errCode":1822}]}`

This means the **REST API requires a login/session first** before you can call other endpoints.

---

## 🔍 What This Means

The API likely works like this:
1. **First:** Login to get a session/token
   - Endpoint: `/REST/login` or `/REST/Auth/login` or similar
   - Send: `username` and `password`
   - Get back: Session cookie or token

2. **Then:** Use that session for API calls
   - Include session cookie in headers
   - Or use token in `Authorization` header

---

## 📋 What You Need to Ask Your Developer

**Critical questions:**

1. **What is the login endpoint?**
   - Is it `/REST/login`?
   - Or `/REST/Auth/login`?
   - Or something else?

2. **What format does login expect?**
   ```json
   {
     "username": "...",
     "password": "..."
   }
   ```
   Or different field names?

3. **What does login return?**
   - Session cookie?
   - Token?
   - Both?

4. **What are the login credentials?**
   - Username?
   - Password?

5. **How long does the session last?**
   - 1 hour?
   - 24 hours?
   - Until logout?

---

## ⚙️ Current Code Status

I've updated the code to:
- ✅ Support REST login flow
- ✅ Store session in memory
- ✅ Automatically login before API calls
- ✅ Handle session expiry

**But we need:**
- ❌ The actual login endpoint URL
- ❌ Login credentials (username/password)
- ❌ Login request/response format

---

## 🔧 Configuration (Once You Have Info)

Add to `.env.local`:

```env
# API Base URL
EXCHANGE_RATE_API_BASE=https://nzcportal.lotusfx.com

# Exchange Rate Endpoint
EXCHANGE_RATE_API_URL=https://nzcportal.lotusfx.com/REST/Currencies/getExchangeRate

# Login Endpoint (update once you know the correct path)
EXCHANGE_RATE_LOGIN_URL=https://nzcportal.lotusfx.com/REST/login

# Login Credentials
EXCHANGE_RATE_USERNAME=your_username_here
EXCHANGE_RATE_PASSWORD=your_password_here
```

---

## 🧪 Testing

Once configured:

1. **Restart server:**
   ```bash
   npm run dev
   ```

2. **Test login:**
   - Go to: `http://localhost:8004/test-calculator`
   - Check server console for login attempts
   - See if session is created

3. **Test API call:**
   - Try the exchange rate request
   - Should work if login succeeded

---

## 📝 Next Steps

1. **Get login endpoint URL from developer**
2. **Get login credentials**
3. **Update `.env.local`**
4. **Test using `/test-calculator` page**
5. **Check server logs for login success/failure**

---

## 🔍 Common Login Endpoints

Try these common patterns:
- `/REST/login`
- `/REST/Auth/login`
- `/REST/Authentication/login`
- `/api/login`
- `/api/auth/login`

**Ask your developer which one it is!**

---

**Once you have the login endpoint and credentials, I can help you test it!**
