# 🔧 Manual Subscription Upgrade Guide

## For Testing Without Payment Integration

---

## Method 1: Using API Endpoint (Easiest) ⭐

### Step 1: Get Your JWT Token
1. Login to your account at: https://finvoice-ai-kappa.vercel.app
2. Open browser DevTools (F12) → Console tab
3. Type: `localStorage.getItem('token')`
4. Copy the token (long string starting with `eyJ...`)

### Step 2: Upgrade Using cURL

**Upgrade to Yearly Plan:**
```bash
curl -X POST https://fin-voice-backend.onrender.com/api/admin/upgrade-user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"tier": "yearly", "months": 12}'
```

**Upgrade to Quarterly Plan:**
```bash
curl -X POST https://fin-voice-backend.onrender.com/api/admin/upgrade-user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"tier": "quarterly", "months": 3}'
```

**Upgrade to Monthly Plan:**
```bash
curl -X POST https://fin-voice-backend.onrender.com/api/admin/upgrade-user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"tier": "monthly", "months": 1}'
```

### Step 3: Verify Upgrade
```bash
curl https://fin-voice-backend.onrender.com/api/admin/my-subscription \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 4: Refresh Your App
- Reload the page
- You should now have access to premium features!

---

## Method 2: Using Postman/Insomnia

1. **Create POST request** to:
   ```
   https://fin-voice-backend.onrender.com/api/admin/upgrade-user
   ```

2. **Add Headers:**
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   Content-Type: application/json
   ```

3. **Add Body (JSON):**
   ```json
   {
     "tier": "yearly",
     "months": 12
   }
   ```

4. **Send Request** → Should return success message

---

## Method 3: Direct MongoDB Update

### Using MongoDB Atlas Dashboard:

1. Go to: https://cloud.mongodb.com
2. Login → Select your cluster
3. Click **"Browse Collections"**
4. Find **"finvoice"** database → **"users"** collection
5. Find your user by email
6. Click **"Edit"** (pencil icon)
7. Update these fields:
   ```json
   {
     "subscriptionTier": "yearly",
     "subscriptionExpiry": "2025-12-18T00:00:00.000Z",
     "monthlyTransactionCount": 0
   }
   ```
8. Click **"Update"**

### Using MongoDB Compass (Desktop App):

1. Download: https://www.mongodb.com/try/download/compass
2. Connect using your MongoDB URI
3. Navigate to: `finvoice` → `users`
4. Find your user document
5. Click document → Edit
6. Update fields as above
7. Save

### Using MongoDB Shell:

```javascript
// Connect to your database
use finvoice

// Find your user
db.users.findOne({ email: "your-email@gmail.com" })

// Update subscription
db.users.updateOne(
  { email: "your-email@gmail.com" },
  {
    $set: {
      subscriptionTier: "yearly",
      subscriptionExpiry: new Date("2025-12-18"),
      monthlyTransactionCount: 0,
      lastResetDate: new Date()
    }
  }
)

// Verify update
db.users.findOne({ email: "your-email@gmail.com" })
```

---

## Subscription Tiers Reference:

| Tier | Value | Features |
|------|-------|----------|
| Free | `"free"` | 50 transactions/month, basic features |
| Monthly | `"monthly"` | 150 transactions/month, reports + alerts |
| Quarterly | `"quarterly"` | 550 transactions/3mo, + AI Voice (Whisper) |
| Yearly | `"yearly"` | Unlimited transactions, + GPT-3.5 AI |

---

## Testing Checklist:

- [ ] Upgrade account to Yearly plan
- [ ] Verify subscription in app (check profile page)
- [ ] Test AI Voice feature (should work with Quarterly+)
- [ ] Test GPT Insights (should work with Yearly only)
- [ ] Try accessing AI features with Free plan (should show upgrade modal)
- [ ] Check transaction limits are updated

---

## Troubleshooting:

**"User not found" error:**
- Token might be expired, login again
- Check token is copied correctly (no extra spaces)

**Changes not reflecting in app:**
- Hard refresh the page (Ctrl+Shift+R)
- Clear browser cache
- Logout and login again

**"Feature not available" error:**
- Subscription tier might not be saved correctly
- Check MongoDB to verify tier is updated
- Ensure subscriptionExpiry is in the future

---

## 🎯 Quick Test Script:

Save this as `upgrade-test.sh`:

```bash
#!/bin/bash

# Replace with your actual token
TOKEN="YOUR_JWT_TOKEN_HERE"
API_URL="https://fin-voice-backend.onrender.com"

echo "🔄 Upgrading to Yearly plan..."
curl -X POST $API_URL/api/admin/upgrade-user \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tier": "yearly", "months": 12}'

echo -e "\n\n✅ Checking subscription status..."
curl $API_URL/api/admin/my-subscription \
  -H "Authorization: Bearer $TOKEN"

echo -e "\n\n🎉 Done! Refresh your app to see changes."
```

Run with: `bash upgrade-test.sh`

---

## 💳 Future: Real Payment Integration

When ready for production, integrate:

### Razorpay (India):
- Easy integration
- UPI, Cards, Wallets
- ~2% transaction fee
- Docs: https://razorpay.com/docs/

### Stripe (International):
- Global payment support
- Subscription management
- ~2.9% + ₹2 per transaction
- Docs: https://stripe.com/docs

### Implementation Steps:
1. Create payment gateway account
2. Add payment routes to backend
3. Create checkout page in frontend
4. Handle webhooks for payment confirmation
5. Auto-upgrade user on successful payment

---

Need help? The admin endpoint is ready to use right now for testing! 🚀
