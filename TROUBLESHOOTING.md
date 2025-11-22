# Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### 1. "MongoDB Connection Failed"
**Problem**: Can't connect to MongoDB Atlas

**Solutions**:
- Check your `.env` file has correct `MONGO_URI`
- Verify MongoDB Atlas cluster is running
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure network connection is stable
- Try: `0.0.0.0/0` for IP whitelist (demo only, not production!)

#### 2. "Port 5000 already in use"
**Problem**: Another process is using port 5000

**Solutions**:
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID with actual number)
kill -9 PID

# Or change port in .env
PORT=5001
```

#### 3. "Module not found" errors
**Problem**: Missing dependencies

**Solution**:
```bash
cd finvoice-backend
rm -rf node_modules package-lock.json
npm install
```

#### 4. "JWT_SECRET is not defined"
**Problem**: Environment variables not loaded

**Solutions**:
- Check `.env` file exists in `finvoice-backend/`
- Verify `JWT_SECRET=supersecretkey` is in `.env`
- Restart the backend server
- Make sure `dotenv` is installed: `npm install dotenv`

### Frontend Issues

#### 1. "Failed to fetch" or "Network Error"
**Problem**: Frontend can't reach backend

**Solutions**:
- Verify backend is running on port 5000
- Check `http://localhost:5000` in browser (should show "Backend is running")
- Verify API URLs in components use `http://localhost:5000`
- Check browser console for CORS errors
- Disable browser extensions that might block requests

#### 2. "Port 3000 already in use"
**Problem**: Another React app is running

**Solutions**:
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 PID

# Or run on different port
PORT=3001 npm start
```

#### 3. Blank page or white screen
**Problem**: JavaScript error or build issue

**Solutions**:
- Open browser DevTools (F12) and check Console tab
- Clear browser cache (Ctrl+Shift+Delete)
- Delete `node_modules` and reinstall:
```bash
cd finvoice-frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 4. "Token is not valid" after login
**Problem**: JWT token issue

**Solutions**:
- Clear localStorage: Open DevTools → Application → Local Storage → Clear
- Logout and login again
- Check if backend JWT_SECRET matches
- Verify token is being sent in Authorization header

### Data Issues

#### 1. Dashboard shows no data
**Problem**: No transactions or alerts created yet

**Solution**:
- This is normal for new accounts
- Add some transactions in Balance Sheet
- Create alerts in Payable Alerts
- Refresh dashboard

#### 2. Transactions not appearing
**Problem**: API call failed or data not saved

**Solutions**:
- Check browser console for errors
- Verify backend logs for errors
- Check MongoDB Atlas to see if data is saved
- Try logging out and back in
- Verify token is valid

#### 3. Balance calculations wrong
**Problem**: Logic error or data type issue

**Solutions**:
- Check if amounts are numbers (not strings)
- Verify transaction types are "income" or "expense"
- Look at backend logs for calculation errors
- Check MongoDB data directly

### Authentication Issues

#### 1. Can't register new user
**Problem**: User already exists or validation error

**Solutions**:
- Try different email address
- Check if email format is valid
- Verify all required fields are filled
- Check backend logs for specific error
- Ensure MongoDB connection is working

#### 2. Can't login
**Problem**: Wrong credentials or server error

**Solutions**:
- Verify email and password are correct
- Check if user was successfully registered
- Try registering again with new email
- Check backend logs
- Verify MongoDB has the user data

#### 3. Automatically logged out
**Problem**: Token expired or cleared

**Solutions**:
- JWT tokens expire after 7 days (check authroutes.js)
- Login again
- Check if localStorage was cleared
- Verify token expiration time in backend

### UI/Display Issues

#### 1. Styling looks broken
**Problem**: CSS not loading or conflicts

**Solutions**:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check if `App.css` is imported in `App.js`
- Verify no CSS syntax errors
- Try different browser

#### 2. Buttons not working
**Problem**: JavaScript error or event handler issue

**Solutions**:
- Check browser console for errors
- Verify onClick handlers are attached
- Check if functions are defined
- Try hard refresh
- Check if JavaScript is enabled

#### 3. Mobile view broken
**Problem**: Responsive CSS not working

**Solutions**:
- Check browser DevTools → Toggle device toolbar
- Verify media queries in CSS
- Test on actual mobile device
- Check viewport meta tag in index.html

## Testing Commands

### Test Backend
```bash
# Check if backend is running
curl http://localhost:5000

# Test API endpoints
cd finvoice-backend
node test-api.js
```

### Test Frontend
```bash
# Check for build errors
cd finvoice-frontend
npm run build

# Check for linting issues
npm run lint
```

### Check Logs
```bash
# Backend logs
cd finvoice-backend
npm start
# Watch terminal output

# Frontend logs
# Open browser DevTools → Console tab
```

## Emergency Demo Fixes

### If backend crashes during demo:
1. Quickly restart: `npm start`
2. While restarting, explain the architecture
3. Show the code and explain what it does
4. Have screenshots ready as backup

### If frontend crashes during demo:
1. Hard refresh: Ctrl+Shift+R
2. If that fails, show backend API with Postman/curl
3. Explain the API endpoints and responses
4. Show the React component code

### If database connection fails:
1. Switch to explaining the schema design
2. Show the models in code
3. Discuss data relationships
4. Have sample JSON responses ready

## Prevention Tips

### Before Demo Day:
- [ ] Test everything the night before
- [ ] Test on the actual presentation machine
- [ ] Have backup screenshots/video
- [ ] Clear browser cache
- [ ] Restart both servers fresh
- [ ] Check MongoDB Atlas is accessible
- [ ] Verify internet connection
- [ ] Close unnecessary applications
- [ ] Have this troubleshooting guide open

### During Demo:
- [ ] Start servers 5 minutes before
- [ ] Have DevTools open in background
- [ ] Keep terminal windows visible
- [ ] Have backup browser tab ready
- [ ] Stay calm if something breaks
- [ ] Explain what you're doing

## Getting Help

### Resources:
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/
- JWT Docs: https://jwt.io/

### Quick Checks:
1. Is MongoDB Atlas accessible?
2. Are both servers running?
3. Are there errors in terminal?
4. Are there errors in browser console?
5. Is the network connection stable?

### Debug Mode:
Add console.logs to track issues:
```javascript
// In backend routes
console.log('Request received:', req.body);
console.log('User ID:', req.userId);

// In frontend components
console.log('API Response:', data);
console.log('Token:', localStorage.getItem('token'));
```

Remember: Even if something breaks, explaining how you'd fix it demonstrates problem-solving skills!
