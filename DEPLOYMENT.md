# 🚀 Deployment Guide

## What's Done ✅
- Frontend: https://MrAniketPatel.github.io/finvoice-ai
- Security: Rate limiting, input validation, CORS, strong JWT
- MongoDB: Already setup

## Deploy Backend (15 mins)
1. Go to https://render.com → New Web Service
2. Connect repo: `finvoice-ai`
3. Settings:
   - Root: `finvoice-backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add env vars:
   ```
   MONGO_URI=mongodb+srv://aniket-void:NEW_PASSWORD@cluster0...
   JWT_SECRET=8f9a2b7c4e1d6f3a9b8c7e5d4f2a1b9c8e7d6f5a4b3c2e1d9f8a7b6c5e4d3f2a1b0c9e8d7f6a5b4c3e2d1f0a9b8c7e6d5f4a3b2c1e0d9f8a7b6c5e4d3f2a1b0
   PORT=5000
   ```
5. Copy backend URL

## Connect Frontend
1. Create `finvoice-frontend/.env`:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com
   ```
2. Run: `cd finvoice-frontend && npm run deploy`

## Critical
⚠️ Rotate MongoDB password (exposed in Git history)
