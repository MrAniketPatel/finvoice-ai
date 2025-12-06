# How to Test Mobile View

## Method 1: Browser DevTools (Easiest) ⭐

### Chrome / Edge:
1. Open your app: http://localhost:3000
2. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Click the **device toggle icon** (📱) or press `Ctrl+Shift+M`
4. Select a device from dropdown:
   - iPhone 12 Pro
   - iPhone SE
   - Samsung Galaxy S20
   - iPad
   - Or choose "Responsive" and drag to resize

### Firefox:
1. Press `F12`
2. Click **Responsive Design Mode** icon (📱)
3. Or press `Ctrl+Shift+M`
4. Choose device or custom size

### Safari:
1. Press `Cmd+Option+I`
2. Click **Responsive Design Mode** icon
3. Choose device

---

## Method 2: Resize Browser Window

1. Open app in browser
2. Make browser window narrow (< 768px wide)
3. Hamburger menu should appear
4. Desktop menu should disappear

---

## Method 3: Test on Real Device

### Option A: Same Network
1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   # or
   ip addr show
   ```
2. On your phone, open browser
3. Go to: `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

### Option B: ngrok (Public URL)
1. Install ngrok: https://ngrok.com/
2. Run: `ngrok http 3000`
3. Use the https URL on any device

---

## What to Test on Mobile

### Navigation:
- [ ] Hamburger icon (☰) visible
- [ ] Desktop menu hidden
- [ ] Click hamburger → menu slides down
- [ ] Click menu item → goes to page
- [ ] Menu closes after selection
- [ ] Overlay closes menu when tapped

### Layout:
- [ ] Content fits screen width
- [ ] No horizontal scrolling
- [ ] Text is readable
- [ ] Buttons are tappable (not too small)
- [ ] Forms work properly
- [ ] Cards stack vertically

### Features:
- [ ] Login/Register works
- [ ] Add transactions works
- [ ] View balance sheet works
- [ ] Create alerts works
- [ ] Profile updates work
- [ ] Logout works

### Performance:
- [ ] Pages load quickly
- [ ] Animations are smooth
- [ ] No lag when scrolling
- [ ] Touch gestures work

---

## Current Breakpoint

**Desktop**: > 768px width
- Shows full horizontal menu
- No hamburger icon

**Mobile**: ≤ 768px width
- Shows hamburger icon (☰)
- Hides desktop menu
- Dropdown menu on click

---

## Quick Test Sizes

### Common Mobile Widths:
- **iPhone SE**: 375px
- **iPhone 12/13**: 390px
- **iPhone 12 Pro Max**: 428px
- **Samsung Galaxy**: 360px
- **iPad**: 768px (tablet)
- **iPad Pro**: 1024px (desktop)

### Test at:
- 375px (small phone)
- 768px (breakpoint)
- 1024px (tablet/small desktop)

---

## Debugging Mobile Issues

### If hamburger doesn't show:
1. Check browser width is < 768px
2. Clear cache: `Ctrl+Shift+R`
3. Check CSS loaded properly

### If menu doesn't open:
1. Check browser console for errors (F12)
2. Make sure JavaScript is enabled
3. Try different browser

### If layout is broken:
1. Check viewport meta tag in index.html
2. Clear browser cache
3. Check CSS media queries

---

## Pro Tips

### Chrome DevTools:
- **Throttling**: Simulate slow 3G/4G
- **Touch simulation**: Test touch events
- **Rotate**: Test landscape/portrait
- **Screenshot**: Capture mobile view

### Keyboard Shortcuts:
- `Ctrl+Shift+M`: Toggle device mode
- `Ctrl+Shift+R`: Hard refresh
- `F12`: Open DevTools

---

## Expected Mobile Behavior

### Navigation:
✅ Hamburger icon in top-right
✅ Click → menu slides down from top
✅ White background menu
✅ Each item with icon
✅ Active item highlighted
✅ Alert badge visible
✅ Logout at bottom
✅ Click item → menu closes
✅ Click overlay → menu closes

### Desktop Behavior:
✅ Full horizontal menu
✅ No hamburger icon
✅ All items visible
✅ Active state highlighting
✅ Logout button on right

---

## Screenshots

To take screenshots in DevTools:
1. Open DevTools (F12)
2. Toggle device mode (Ctrl+Shift+M)
3. Click three dots (⋮) in device toolbar
4. Click "Capture screenshot"

---

## Common Issues

### Issue: Menu doesn't close
**Fix**: Click outside menu or click hamburger again

### Issue: Can't tap buttons
**Fix**: Buttons might be too small, increase padding

### Issue: Text too small
**Fix**: Increase font-size in mobile CSS

### Issue: Horizontal scroll
**Fix**: Check for fixed widths, use max-width: 100%

---

## Testing Checklist

Before delivering to client:

- [ ] Test on Chrome mobile view
- [ ] Test on Firefox mobile view
- [ ] Test on real iPhone (if available)
- [ ] Test on real Android (if available)
- [ ] Test all features work on mobile
- [ ] Test landscape orientation
- [ ] Test on slow connection
- [ ] Take screenshots for documentation

---

## Quick Start

**Right now, to see mobile view:**

1. Open http://localhost:3000
2. Press `F12`
3. Press `Ctrl+Shift+M`
4. Select "iPhone 12 Pro" from dropdown
5. Refresh page
6. You should see hamburger menu (☰)

**That's it!** 🎉
