# Custom Domain Setup Guide

## Problem
After setting up a custom domain, the dashboard and some parts are not loading.

## Root Cause
The frontend is trying to make API calls to the backend, but either:
1. Environment variables aren't set correctly in Vercel
2. CORS is blocking the new domain
3. The custom domain isn't properly configured

---

## Solution Steps

### Step 1: Configure Custom Domain in Vercel

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: finvoice-ai (or whatever you named it)
3. **Go to Settings** → **Domains**
4. **Add your custom domain**: e.g., `finvoice.com`
5. **Follow Vercel's DNS instructions**:
   - Add A record or CNAME record to your domain registrar
   - Wait for DNS propagation (5-30 minutes)

### Step 2: Update Environment Variables in Vercel

1. **Go to Settings** → **Environment Variables**
2. **Check if `REACT_APP_API_URL` exists**:
   - If YES: Make sure value is `https://fin-voice-backend.onrender.com`
   - If NO: Add it with value `https://fin-voice-backend.onrender.com`
3. **Make sure it's enabled for**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. **Save changes**

### Step 3: Redeploy Frontend

1. **Go to Deployments** tab
2. **Find latest deployment**
3. **Click "..." menu** → **Redeploy**
4. **Wait for deployment** (~2 minutes)

### Step 4: Update Backend CORS (if needed)

If you want to restrict API access to only your domains:

1. **Open**: `finvoice-backend/server.js`
2. **Find the CORS section** (around line 30)
3. **Replace `YOUR-NEW-DOMAIN.com`** with your actual domain
4. **Example**:
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://finvoice-ai-kappa.vercel.app',
     'https://finvoice.com',
     'https://www.finvoice.com',
   ];
   ```
5. **Commit and push**:
   ```bash
   git add finvoice-backend/server.js
   git commit -m "feat: Add custom domain to CORS"
   git push origin main
   ```
6. **Wait for Render to redeploy** (~2 minutes)

### Step 5: Update Backend Environment (Optional)

If you want to track the frontend URL in backend:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select**: fin-voice-backend
3. **Go to Environment**
4. **Update `FRONTEND_URL`**: 
   - From: `http://localhost:3000`
   - To: `https://your-domain.com`
5. **Save** (will trigger redeploy)

---

## Verification Checklist

After completing the steps above:

- [ ] Custom domain loads the homepage
- [ ] Can register a new account
- [ ] Can login successfully
- [ ] Dashboard loads with stats
- [ ] Can add transactions
- [ ] Can view balance sheet
- [ ] Voice button appears (if subscribed)
- [ ] No CORS errors in browser console (F12)

---

## Common Issues & Fixes

### Issue 1: "Failed to load resource: net::ERR_NAME_NOT_RESOLVED"
**Cause**: DNS not propagated yet  
**Fix**: Wait 5-30 minutes, clear browser cache, try incognito mode

### Issue 2: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Cause**: Backend doesn't allow your new domain  
**Fix**: Update CORS in `finvoice-backend/server.js` (see Step 4)

### Issue 3: Dashboard shows "Loading..." forever
**Cause**: API URL not set in Vercel environment  
**Fix**: Add `REACT_APP_API_URL` in Vercel settings (see Step 2)

### Issue 4: API calls go to localhost:5000
**Cause**: Environment variable not loaded  
**Fix**: Redeploy after adding environment variable (see Step 3)

### Issue 5: "Mixed Content" error (HTTP/HTTPS)
**Cause**: Trying to call HTTP API from HTTPS site  
**Fix**: Make sure backend URL uses `https://` not `http://`

---

## Testing

### Test API Connection
Open browser console (F12) on your custom domain and run:

```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

Should show: `https://fin-voice-backend.onrender.com`

### Test Backend
Visit: `https://fin-voice-backend.onrender.com`  
Should show: "✅ FinVoice.AI Backend is running..."

### Test CORS
Open browser console (F12) and run:

```javascript
fetch('https://fin-voice-backend.onrender.com/api/dashboard', {
  headers: { 'Authorization': 'Bearer your-token-here' }
})
.then(r => r.json())
.then(d => console.log('✅ CORS working:', d))
.catch(e => console.error('❌ CORS error:', e));
```

---

## DNS Configuration Examples

### For Vercel (Recommended)

**A Record** (for root domain):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME Record** (for www):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Alternative: CNAME Only
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

---

## Quick Checklist

1. ✅ Domain added in Vercel
2. ✅ DNS records configured
3. ✅ `REACT_APP_API_URL` set in Vercel
4. ✅ Frontend redeployed
5. ✅ CORS updated in backend (if needed)
6. ✅ Backend redeployed (if CORS changed)
7. ✅ Test login and dashboard

---

**Need help?** Check browser console (F12) for specific error messages!
