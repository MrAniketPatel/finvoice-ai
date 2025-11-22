# Voice Feature Troubleshooting

## Quick Checks

### 1. Is the voice button visible?
- **Dashboard**: Should see a white card with "🎤 Voice Assistant" at the top
- **All pages**: Should see a circular purple/teal gradient button in bottom-right corner

### 2. Browser Compatibility
✅ **Supported**:
- Chrome (Desktop & Mobile)
- Edge (Desktop)
- Safari (Desktop & iOS)

❌ **NOT Supported**:
- Firefox
- Opera
- Older browsers

**Test**: Open browser console (F12) and type:
```javascript
console.log('Speech Recognition:', window.SpeechRecognition || window.webkitSpeechRecognition);
```
If it shows `undefined`, your browser doesn't support it.

### 3. Microphone Permission

**First time you click the mic button:**
- Browser will ask: "Allow microphone access?"
- Click "Allow"

**If you accidentally blocked it:**
1. Click the lock icon in address bar
2. Find "Microphone" setting
3. Change to "Allow"
4. Refresh the page

### 4. Backend Connection

Voice needs backend to save transactions/alerts.

**Check backend is running:**
```bash
curl http://localhost:5000
```
Should return: "✅ FinVoice.AI Backend is running..."

**If not running:**
```bash
cd finvoice-backend
npm start
```

### 5. Test Voice Recognition

**Open browser console (F12) and paste this:**
```javascript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-IN';
recognition.onresult = (event) => {
  console.log('You said:', event.results[0][0].transcript);
};
recognition.start();
console.log('Speak now!');
```

Then speak. If you see "You said: [your text]", voice recognition works!

## Common Issues

### Issue 1: Button doesn't respond
**Symptoms**: Click mic button, nothing happens

**Solutions**:
1. Check browser console for errors (F12)
2. Make sure you're logged in
3. Try hard refresh: Ctrl+Shift+R
4. Check if backend is running

### Issue 2: "Voice not supported" message
**Symptoms**: See message about browser not supporting voice

**Solutions**:
1. Switch to Chrome, Edge, or Safari
2. Update your browser to latest version
3. Use the manual input forms instead

### Issue 3: Mic button turns red but doesn't listen
**Symptoms**: Button changes color but doesn't capture voice

**Solutions**:
1. Check microphone permission (see step 3 above)
2. Make sure microphone is working (test in other apps)
3. Close other apps using microphone
4. Try unplugging/replugging headset

### Issue 4: Voice captured but nothing happens
**Symptoms**: See "You said: [text]" but no transaction added

**Solutions**:
1. Check backend is running: `curl http://localhost:5000`
2. Check browser console for API errors
3. Make sure you're logged in (check localStorage has token)
4. Try saying amount more clearly: "five hundred" or "500"

### Issue 5: Wrong amount or category detected
**Symptoms**: Voice works but parses incorrectly

**Solutions**:
1. Speak more clearly and slowly
2. Use numbers instead of words: "500" not "five hundred"
3. Include "rupees" or "rs": "500 rupees for food"
4. Use common categories: food, rent, salary, transport

## Testing Commands

### Good Commands (should work):
✅ "Add expense 500 rupees for food"
✅ "Income 5000 salary"
✅ "Expense 200 for transport"
✅ "Earned 10000 from freelance"
✅ "Remind me rent payment 15000 next week"
✅ "Alert credit card 5000 tomorrow"

### Bad Commands (might not work):
❌ "I spent some money on food" (no amount)
❌ "Add transaction" (too vague)
❌ "Five hundred" (no context)
❌ "Food expense" (no amount)

## Debug Mode

### Enable verbose logging:

**1. Open browser console (F12)**

**2. Add this to see what's happening:**
```javascript
// Override console.log to see voice events
const originalLog = console.log;
console.log = function(...args) {
  originalLog.apply(console, ['[DEBUG]', ...args]);
};
```

**3. Click voice button and speak**

**4. Look for these logs:**
- "Speech Recognition: [object]" - Voice API available
- "You said: [text]" - Voice captured
- "Parsed: {type, amount, category}" - Parsing successful
- "API Response: [data]" - Backend saved it

## Manual Testing

If voice isn't working, you can still test the app:

**Add Transaction Manually:**
1. Go to Balance Sheet
2. Fill the form:
   - Type: Income/Expense
   - Amount: 500
   - Category: Food
   - Description: Lunch
3. Click "Add Transaction"

**Add Alert Manually:**
1. Go to Payable Alerts
2. Fill the form:
   - Title: Rent Payment
   - Amount: 15000
   - Due Date: [pick date]
   - Category: Rent
3. Click "Add Alert"

## Still Not Working?

### Check these files exist:
```bash
ls finvoice-frontend/src/hooks/useVoiceInput.js
ls finvoice-frontend/src/utils/voiceParser.js
ls finvoice-frontend/src/components/VoiceAssistant.js
ls finvoice-frontend/src/components/FloatingVoiceButton.js
```

### Restart everything:
```bash
# Kill all processes
pkill -9 node

# Start backend
cd finvoice-backend
npm start

# Start frontend (new terminal)
cd finvoice-frontend
npm start
```

### Clear browser cache:
1. Press Ctrl+Shift+Delete
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page

## For Demo Purposes

If voice isn't working during demo:

**Plan A**: Use the floating button instead of dashboard card

**Plan B**: Show the code and explain how it works

**Plan C**: Use manual forms and say:
"The voice feature works in Chrome/Edge/Safari. For this demo, I'll show the manual input which also works great."

## Contact Info

If nothing works, the issue might be:
- Network/firewall blocking microphone
- Corporate browser restrictions
- Antivirus blocking Web Speech API
- Browser extension interfering

Try in incognito mode to rule out extensions!
