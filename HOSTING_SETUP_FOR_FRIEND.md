# FinVoice.AI - Hosting Setup Guide (For Your Friend)

## What Your Friend Needs to Host

### Backend Requirements:
- Node.js hosting (v14 or higher)
- MongoDB database
- Environment variables support

### Frontend Requirements:
- Static file hosting (HTML/CSS/JS)
- HTTPS support (recommended)

---

## Files to Give Your Friend

### 1. Backend Package
```
finvoice-backend/
├── config/
├── models/
├── routes/
├── middlewares/
├── server.js
├── package.json
└── .env.example
```

### 2. Frontend Build
```bash
cd finvoice-frontend
npm run build
```
This creates a `build/` folder - give this to your friend.

---

## Environment Variables Needed

### Backend `.env` file:
```
MONGO_URI=mongodb://your-friend-database-url
JWT_SECRET=your-secret-key-here
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

---

## Setup Instructions for Your Friend

### Step 1: Backend Setup

1. **Upload backend files** to server
2. **Install dependencies**:
   ```bash
   cd finvoice-backend
   npm install --production
   ```
3. **Create `.env` file** with the variables above
4. **Start the server**:
   ```bash
   npm start
   ```
   Or use PM2 for production:
   ```bash
   npm install -g pm2
   pm2 start server.js --name finvoice-backend
   pm2 save
   pm2 startup
   ```

### Step 2: Frontend Setup

1. **Upload `build/` folder** contents to web root
2. **Configure web server** (Apache/Nginx)

#### For Apache (.htaccess):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### For Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Step 3: Update API URL

Before building, update `finvoice-frontend/.env`:
```
REACT_APP_API_URL=https://your-backend-domain.com
```

Then rebuild:
```bash
npm run build
```

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud - Free)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Whitelist your friend's server IP

### Option 2: Self-Hosted MongoDB
Your friend installs MongoDB on their server:
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

Connection string: `mongodb://localhost:27017/FinVoiceBeta`

---

## Testing After Deployment

### 1. Test Backend:
```bash
curl https://your-backend-domain.com
```
Should return: "✅ FinVoice.AI Backend is running..."

### 2. Test Frontend:
Open: `https://your-frontend-domain.com`
Should show landing page

### 3. Test Full Flow:
1. Register new account
2. Login
3. Add transaction
4. Create alert
5. Update profile

---

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Strong JWT_SECRET (random 32+ characters)
- [ ] MongoDB authentication enabled
- [ ] Firewall configured
- [ ] CORS properly set
- [ ] Environment variables secured
- [ ] Regular backups enabled

---

## Maintenance

### Update Application:
```bash
# Backend
cd finvoice-backend
git pull
npm install
pm2 restart finvoice-backend

# Frontend
cd finvoice-frontend
npm run build
# Upload new build/ folder
```

### Monitor Logs:
```bash
# PM2 logs
pm2 logs finvoice-backend

# Or direct logs
tail -f /path/to/logs
```

### Backup Database:
```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/backup/path
```

---

## Troubleshooting

### Backend Issues:
- Check logs: `pm2 logs`
- Verify MongoDB connection
- Check environment variables
- Ensure port 5000 is open

### Frontend Issues:
- Check browser console (F12)
- Verify API_URL is correct
- Check CORS settings
- Clear browser cache

### Database Issues:
- Check MongoDB is running
- Verify connection string
- Check IP whitelist (if Atlas)
- Test connection: `mongo your-connection-string`

---

## Performance Tips

### Backend:
- Use PM2 cluster mode: `pm2 start server.js -i max`
- Enable gzip compression
- Add rate limiting
- Use caching where appropriate

### Frontend:
- Enable gzip on web server
- Set proper cache headers
- Use CDN for static assets
- Minify assets (already done in build)

---

## Cost Estimate (If Using Cloud)

### Free Tier:
- MongoDB Atlas: Free (512MB)
- Backend: Your friend's hosting
- Frontend: Your friend's hosting
- **Total: ₹0 extra**

### Paid (if needed):
- MongoDB Atlas M10: ₹1,200/month
- SSL Certificate: Free (Let's Encrypt)
- Domain: ₹500/year

---

## Support

If your friend needs help:
1. Check logs first
2. Verify all environment variables
3. Test each component separately
4. Check firewall/security settings

---

## Quick Start Commands

```bash
# Backend
cd finvoice-backend
npm install
# Create .env file
npm start

# Frontend (build)
cd finvoice-frontend
# Update .env with backend URL
npm run build
# Upload build/ folder to web server
```

---

## What to Provide Your Friend

1. ✅ Backend folder (`finvoice-backend/`)
2. ✅ Frontend build folder (`finvoice-frontend/build/`)
3. ✅ This setup guide
4. ✅ Environment variables template
5. ✅ MongoDB connection details
6. ✅ API documentation (if needed)

---

Your friend should be able to deploy this in 30-60 minutes! 🚀
