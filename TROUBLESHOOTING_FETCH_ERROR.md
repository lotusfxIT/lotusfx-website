# Troubleshooting "fetch failed" Error

## Issue
The API works from PowerShell but fails from Node.js with "fetch failed" error.

## Possible Causes

1. **SSL Certificate Issue**: Node.js might be stricter about SSL certificates
2. **Network Configuration**: Firewall or proxy blocking Node.js requests
3. **DNS Resolution**: Node.js might resolve DNS differently
4. **Node.js Fetch Implementation**: Different behavior than browser fetch

## Solutions to Try

### Solution 1: Check if it's an SSL issue
The API URL uses HTTPS. Node.js might be rejecting the certificate.

### Solution 2: Test with curl/node directly
Try testing the API from Node.js directly to isolate the issue.

### Solution 3: Check network/firewall
Make sure Node.js can access external HTTPS URLs.

## Current Status
- ✅ API works from PowerShell
- ✅ URL and credentials are correct
- ❌ Node.js fetch is failing

## Next Steps
1. Check server logs for more details
2. Try testing with a simple Node.js script
3. Check if SSL certificates are the issue
