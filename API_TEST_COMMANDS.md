# API Test Commands for Browser Console

## ✅ Authentication Working!
Status: 200 OK
Authentication: ✅ Success

## Current Issue
Error: "Lookup failed: -3"
This means the API needs different/additional parameters.

---

## Test Different Parameters

### Test 1: Try with transferMode
```javascript
fetch('https://nzcportal.lotusfx.com/rst/Currencies/getExchangeRate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-KEY': 'password1234',
    'X-CLIENT': 'Lotus'
  },
  body: JSON.stringify([{
    fromCcy: 'NZD',
    toCcy: 'AUD',
    toAmount: 100,
    transferMode: 'eWire'
  }])
})
.then(r => r.text())
.then(data => {
  console.log('Response:', data)
  try {
    console.log('Parsed:', JSON.parse(data))
  } catch(e) {}
})
```

### Test 2: Try with isBuy parameter
```javascript
fetch('https://nzcportal.lotusfx.com/rst/Currencies/getExchangeRate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-KEY': 'password1234',
    'X-CLIENT': 'Lotus'
  },
  body: JSON.stringify([{
    fromCcy: 'NZD',
    toCcy: 'AUD',
    toAmount: 100,
    isBuy: true
  }])
})
.then(r => r.text())
.then(data => {
  console.log('Response:', data)
  try {
    console.log('Parsed:', JSON.parse(data))
  } catch(e) {}
})
```

### Test 3: Try different currency codes (maybe uppercase?)
```javascript
fetch('https://nzcportal.lotusfx.com/rst/Currencies/getExchangeRate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-KEY': 'password1234',
    'X-CLIENT': 'Lotus'
  },
  body: JSON.stringify([{
    fromCcy: 'nzd',
    toCcy: 'aud',
    toAmount: 100
  }])
})
.then(r => r.text())
.then(data => {
  console.log('Response:', data)
  try {
    console.log('Parsed:', JSON.parse(data))
  } catch(e) {}
})
```

### Test 4: Try with all parameters
```javascript
fetch('https://nzcportal.lotusfx.com/rst/Currencies/getExchangeRate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-KEY': 'password1234',
    'X-CLIENT': 'Lotus'
  },
  body: JSON.stringify([{
    fromCcy: 'NZD',
    toCcy: 'AUD',
    toAmount: 100,
    transferMode: 'eWire',
    isBuy: false
  }])
})
.then(r => r.text())
.then(data => {
  console.log('Response:', data)
  try {
    console.log('Parsed:', JSON.parse(data))
  } catch(e) {}
})
```

---

## Ask Your Developer

The error code "-3" might mean:
- Invalid currency codes
- Missing required parameter
- Currency pair not available
- Wrong parameter format

**Questions to ask:**
1. What does error code "-3" mean?
2. Are the currency codes correct? (NZD, AUD)
3. Are there any required parameters we're missing?
4. What should a successful request look like?
