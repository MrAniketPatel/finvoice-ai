# FinVoice.AI - Quick Deployment Guide

## Pre-Deployment Checklist

### ✅ What's Working:
- [x] User authentication (login/register)
- [x] Dashboard with stats
- [x] Transaction management (add/delete)
- [x] Balance sheet with time filters
- [x] Payment alerts system
- [x] Profile management
- [x] Clean, professional UI
- [x] Voice feature (bonus - works in Chrome/Edge/Safari)

### 🔧 Quick Fixes Needed:

1. **Environment Variables** - Secure your secrets
2. **API URLs** - Change from localhost to production
3. **Build & Deploy** - Get it online

---

## Option 1: FREE Deployment (Recommended)

### Backend: Render.com (Free)
### Frontend: Vercel (Free)
### Database: MongoDB Atlas (Already setup)

**Total Cost: ₹0/month**

---

## Step-by-Step Deployment

### STEP 1: Prepare Backend for Production

#### 1.1 Update CORS for production
```bash
cd finvoice-backend
```

Edit `server.js`:
```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
```

#### 1.2 Add to `.env`:
```
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### 1.3 Create `.gitignore` (if not exists):
```
node_modules/
.env
*.log
```

---

### STEP 2: Deploy Backend to Render

#### 2.1 Push to GitHub:
```bash
cd finvoice-backend
git init
git add .
git commit -m "Backend ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### 2.2 Deploy on Render:
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Settings:
   - **Name**: finvoice-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### 2.3 Add Environment Variables on Render:
- `MONGO_URI` = your MongoDB connection string
- `JWT_SECRET` = supersecretkey
- `PORT` = 5000
- `FRONTEND_URL` = (leave empty for now, add after frontend deploy)

#### 2.4 Deploy!
- Click "Create Web Service"
- Wait 5-10 minutes
- Copy your backend URL: `https://finvoice-backend-xxxx.onrender.com`

---

### STEP 3: Prepare Frontend for Production

#### 3.1 Create `.env` file in `finvoice-frontend/`:
```
REACT_APP_API_URL=https://finvoice-backend-xxxx.onrender.com
```

#### 3.2 Update API calls to use env variable

Create `finvoice-frontend/src/config.js`:
```javascript
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

#### 3.3 Update all API calls:
Replace `http://localhost:5000` with `${API_URL}` in:
- `login.js`
- `register.js`
- `dashboard.js`
- `balancesheet.js`
- `payable-alerts.js`
- `profile.js`
- `VoiceAssistant.js`
- `FloatingVoiceButton.js`

---

### STEP 4: Deploy Frontend to Vercel

#### 4.1 Push to GitHub:
```bash
cd finvoice-frontend
git init
git add .
git commit -m "Frontend ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

#### 4.2 Deploy on Vercel:
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your frontend repo
5. Settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render backend URL
7. Click "Deploy"

#### 4.3 Get your URL:
- Copy: `https://finvoice-ai.vercel.app`

---

### STEP 5: Update Backend CORS

Go back to Render dashboard:
1. Open your backend service
2. Environment → Add variable:
   - `FRONTEND_URL` = your Vercel URL
3. Save and redeploy

---

### STEP 6: Test Production

1. Open your Vercel URL
2. Register a new account
3. Test all features:
   - ✅ Login/Register
   - ✅ Add transactions
   - ✅ View balance sheet
   - ✅ Create alerts
   - ✅ Update profile

---

## Option 2: FASTER - Deploy to Single Platform

### Use Railway.app (Easier but paid after trial)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repo
5. Railway auto-detects and deploys both!

**Cost**: Free for 500 hours/month, then $5/month

---

## Quick Fixes Before Going Live

### Fix 1: Remove Console Logs
```bash
# Search and remove console.logs
grep -r "console.log" finvoice-frontend/src
grep -r "console.log" finvoice-backend
```

### Fix 2: Add Loading States
Already done! ✅

### Fix 3: Error Handling
Already done! ✅

### Fix 4: Secure MongoDB
1. Go to MongoDB Atlas
2. Network Access → Add IP: `0.0.0.0/0` (allow all)
3. Or add Render's IP addresses

---

## Custom Domain (Optional)

### Buy domain from:
- Namecheap: ₹500/year for .com
- GoDaddy: ₹600/year
- Hostinger: ₹400/year

### Connect to Vercel:
1. Vercel Dashboard → Your project → Settings → Domains
2. Add your domain
3. Update DNS records as shown

---

## Post-Deployment

### Monitor:
- Render Dashboard: Check backend logs
- Vercel Dashboard: Check frontend analytics
- MongoDB Atlas: Monitor database usage

### Share:
- Your live URL: `https://finvoice-ai.vercel.app`
- Demo credentials for client
- Documentation links

---

## Troubleshooting

### Backend not responding:
- Check Render logs
- Verify MongoDB connection
- Check environment variables

### Frontend errors:
- Check browser console
- Verify API_URL is correct
- Check CORS settings

### Database issues:
- Check MongoDB Atlas is running
- Verify IP whitelist includes `0.0.0.0/0`
- Check connection string

---

## What Client Gets:

✅ **Live URL** - Accessible from anywhere
✅ **Professional UI** - Clean, modern design
✅ **Full Features** - All CRUD operations working
✅ **Secure** - JWT authentication, encrypted passwords
✅ **Scalable** - Cloud-based, can handle growth
✅ **Free Hosting** - No monthly costs (with free tiers)
✅ **Voice Feature** - Bonus feature that works in Chrome/Edge/Safari

---

## Timeline:

- **Backend Deploy**: 15 minutes
- **Frontend Deploy**: 10 minutes
- **Testing**: 15 minutes
- **Total**: ~40 minutes to go live!

---

## Need Help?

Common issues and solutions in TROUBLESHOOTING.md

Ready to deploy? Let's start with Step 1!
