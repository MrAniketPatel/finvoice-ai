# Pre-Demo Testing Checklist

## Before the Demo

### Backend Check
- [ ] MongoDB connection is working (check .env file)
- [ ] Backend starts without errors: `cd finvoice-backend && npm start`
- [ ] You see "✅ MongoDB Connected Successfully"
- [ ] You see "🚀 Server running on port 5000"

### Frontend Check
- [ ] Frontend starts without errors: `cd finvoice-frontend && npm start`
- [ ] Browser opens to http://localhost:3000
- [ ] No console errors in browser DevTools

### Quick Functionality Test
- [ ] Can register a new account
- [ ] Can login with the account
- [ ] Dashboard loads and shows welcome message
- [ ] Can add a transaction in Balance Sheet
- [ ] Transaction appears in Dashboard
- [ ] Can create a payment alert
- [ ] Alert appears in Dashboard
- [ ] Can update profile information
- [ ] Can logout and login again

## Common Issues & Fixes

### Backend won't start
- Check if MongoDB URI is correct in `.env`
- Make sure port 5000 is not in use
- Run `npm install` in finvoice-backend folder

### Frontend won't start
- Make sure port 3000 is not in use
- Run `npm install` in finvoice-frontend folder
- Clear browser cache

### "Network Error" or "Failed to fetch"
- Make sure backend is running on port 5000
- Check CORS settings in server.js
- Verify API URLs in frontend components

### Data not showing
- Check browser console for errors
- Verify JWT token is stored (check localStorage in DevTools)
- Make sure MongoDB has the data (check MongoDB Atlas)

## Demo Day Preparation

1. **Test everything the night before**
2. **Have backup data ready** (pre-created transactions and alerts)
3. **Clear browser cache** before demo
4. **Close unnecessary applications** to free up resources
5. **Have both terminals ready** (backend and frontend)
6. **Prepare your talking points** from DEMO_SETUP.md
7. **Test on the actual presentation machine** if possible

## Emergency Backup Plan

If something breaks during demo:
1. Have screenshots/video of working app ready
2. Explain the architecture and show the code
3. Walk through the database schema
4. Discuss the API endpoints and their functionality

Remember: Even if there's a bug, explaining how you'd fix it shows problem-solving skills!
