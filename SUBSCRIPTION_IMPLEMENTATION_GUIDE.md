# Subscription System Implementation Guide

## ✅ COMPLETED: Usage Limiting System

### Backend Changes
1. **User Model Updated** (`finvoice-backend/models/user.js`)
   - Added subscription fields: `subscriptionTier`, `subscriptionExpiry`, `subscriptionStartDate`
   - Added usage tracking: `monthlyTransactionCount`, `lastResetDate`
   - Added payment history tracking

2. **Subscription Middleware Created** (`finvoice-backend/middlewares/subscriptionCheck.js`)
   - `canAddTransaction`: Checks if user can add transactions based on their plan
   - `incrementTransactionCount`: Increments counter after successful transaction
   - `requireFeature`: Checks if user has access to premium features
   - `getUsageStats`: Returns usage statistics for frontend
   - Automatic monthly counter reset
   - Subscription expiry checking

3. **Transaction Routes Updated** (`finvoice-backend/routes/transactions.js`)
   - Added `canAddTransaction` middleware to POST route
   - Automatically increments transaction count after creation

4. **Subscription Routes Created** (`finvoice-backend/routes/subscription.js`)
   - `GET /api/subscription/usage`: Get usage statistics
   - `GET /api/subscription/details`: Get subscription details
   - `POST /api/subscription/upgrade`: Upgrade subscription (for testing)

5. **Server Updated** (`finvoice-backend/server.js`)
   - Added subscription routes

### Frontend Changes
1. **Usage Counter Component Created** (`finvoice-frontend/src/components/UsageCounter.js`)
   - Displays current usage vs limit
   - Shows progress bar with color coding
   - Warns when approaching limit
   - Shows upgrade button when needed
   - Handles unlimited plans

2. **CSS Styles Added** (`finvoice-frontend/src/App.css`)
   - Complete styling for usage counter
   - Responsive design
   - Animations and transitions
   - Warning and limit reached states

### Subscription Limits Configuration
```javascript
free: 50 transactions/month
monthly: 150 transactions/month
quarterly: 550 transactions/3 months
yearly: Unlimited transactions
```

---

## 🔧 TODO: Complete Subscription System

### 1. Payment Integration (REQUIRED)

#### Option A: Stripe (Recommended for International)
**Setup Steps:**
1. Create Stripe account at https://stripe.com
2. Install Stripe SDK:
   ```bash
   cd finvoice-backend
   npm install stripe
   ```

3. Create payment routes (`finvoice-backend/routes/payment.js`):
   ```javascript
   - POST /api/payment/create-checkout-session
   - POST /api/payment/webhook (for Stripe webhooks)
   - GET /api/payment/success
   - GET /api/payment/cancel
   ```

4. Add Stripe keys to `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

5. Create Stripe products and prices in dashboard:
   - Monthly Plan: ₹149/month
   - Quarterly Plan: ₹399/3 months
   - Yearly Plan: ₹1499/year

6. Frontend payment flow:
   - User clicks "Subscribe Now"
   - Call backend to create checkout session
   - Redirect to Stripe Checkout
   - Handle success/cancel redirects
   - Update subscription status via webhook

#### Option B: Razorpay (Recommended for India)
**Setup Steps:**
1. Create Razorpay account at https://razorpay.com
2. Install Razorpay SDK:
   ```bash
   cd finvoice-backend
   npm install razorpay
   ```

3. Create payment routes similar to Stripe
4. Add Razorpay keys to `.env`
5. Implement subscription plans in Razorpay dashboard
6. Frontend integration with Razorpay Checkout

**Files to Create:**
- `finvoice-backend/routes/payment.js`
- `finvoice-backend/config/stripe.js` or `razorpay.js`
- `finvoice-frontend/src/components/PaymentModal.js`
- `finvoice-frontend/src/components/CheckoutForm.js`

---

### 2. Premium Features Implementation

#### A. AI Voice Assistant (Whisper API)
**Requirements:**
- OpenAI API key
- Premium subscription check

**Implementation:**
1. Install OpenAI SDK:
   ```bash
   cd finvoice-backend
   npm install openai
   ```

2. Create voice routes (`finvoice-backend/routes/voice.js`):
   ```javascript
   - POST /api/voice/transcribe (requires premium)
   - POST /api/voice/process-command (requires premium)
   ```

3. Add middleware check:
   ```javascript
   router.post('/transcribe', 
     authMiddleware, 
     requireFeature('ai_voice'), 
     transcribeAudio
   );
   ```

4. Frontend updates:
   - Check subscription tier before showing voice button
   - Show upgrade prompt for free users
   - Handle audio recording and upload

**Files to Create:**
- `finvoice-backend/routes/voice.js`
- `finvoice-backend/services/openai.js`
- Update `finvoice-frontend/src/components/VoiceAssistant.js`

#### B. AI Insights (GPT-3.5)
**Implementation:**
1. Create AI insights routes (`finvoice-backend/routes/ai-insights.js`):
   ```javascript
   - POST /api/ai/analyze-spending (requires premium)
   - POST /api/ai/predict-expenses (requires premium)
   - POST /api/ai/recommendations (requires premium)
   ```

2. Add feature checks to existing AI components
3. Show upgrade prompts for free users

**Files to Create:**
- `finvoice-backend/routes/ai-insights.js`
- Update AI components in frontend

#### C. Report Downloads (PDF/Excel)
**Implementation:**
1. Install required packages:
   ```bash
   cd finvoice-backend
   npm install pdfkit exceljs
   ```

2. Create report routes (`finvoice-backend/routes/reports.js`):
   ```javascript
   - GET /api/reports/pdf (requires monthly+)
   - GET /api/reports/excel (requires monthly+)
   ```

3. Add feature check:
   ```javascript
   router.get('/pdf', 
     authMiddleware, 
     requireFeature('reports'), 
     generatePDFReport
   );
   ```

**Files to Create:**
- `finvoice-backend/routes/reports.js`
- `finvoice-backend/services/pdfGenerator.js`
- `finvoice-backend/services/excelGenerator.js`
- `finvoice-frontend/src/components/ReportDownloader.js`

---

### 3. Frontend Integration

#### Update Dashboard Component
**File:** `finvoice-frontend/src/App.js`

Add UsageCounter to dashboard:
```javascript
import UsageCounter from './components/UsageCounter';

// In Dashboard component:
<UsageCounter onUpgradeClick={() => setCurrentPage('subscription')} />
```

#### Update SubscriptionPlans Component
**File:** `finvoice-frontend/src/components/SubscriptionPlans.js`

Connect to payment system:
```javascript
const handleUpgrade = async (plan) => {
  // Call backend to create checkout session
  const response = await axios.post(`${config.API_URL}/payment/create-checkout-session`, {
    plan: plan
  });
  
  // Redirect to Stripe/Razorpay
  window.location.href = response.data.checkoutUrl;
};
```

#### Add Feature Locks
Create a utility to check features:
```javascript
// finvoice-frontend/src/utils/subscriptionUtils.js
export const hasFeature = (userTier, feature) => {
  const features = {
    free: ['basic'],
    monthly: ['basic', 'reports', 'alerts'],
    quarterly: ['basic', 'reports', 'alerts', 'ai_voice'],
    yearly: ['basic', 'reports', 'alerts', 'ai_voice', 'advanced_ai']
  };
  
  return features[userTier]?.includes(feature);
};
```

Use in components:
```javascript
{hasFeature(user.subscriptionTier, 'ai_voice') ? (
  <VoiceButton />
) : (
  <UpgradePrompt feature="AI Voice Assistant" />
)}
```

---

### 4. Database Migration

**Run this to update existing users:**
```javascript
// finvoice-backend/scripts/migrateUsers.js
import User from './models/user.js';
import connectDB from './config/db.js';

connectDB();

const migrateUsers = async () => {
  const users = await User.find({});
  
  for (const user of users) {
    if (!user.subscriptionTier) {
      user.subscriptionTier = 'free';
      user.monthlyTransactionCount = 0;
      user.lastResetDate = new Date();
      await user.save();
    }
  }
  
  console.log('Migration complete');
  process.exit(0);
};

migrateUsers();
```

Run with:
```bash
cd finvoice-backend
node scripts/migrateUsers.js
```

---

### 5. Deployment Configuration

#### Environment Variables Needed
**Backend `.env`:**
```env
# Existing
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
PORT=5000

# New - Payment
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# OR for Razorpay
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...

# New - AI Features
OPENAI_API_KEY=sk-...
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=https://your-backend.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
# OR
REACT_APP_RAZORPAY_KEY_ID=rzp_live_...
```

#### Hosting Options

**Option 1: Simple & Free (Recommended for Start)**
- **Backend:** Render.com (free tier)
- **Frontend:** Vercel (free tier)
- **Database:** MongoDB Atlas (free 512MB)

**Option 2: VPS (More Control)**
- **Server:** DigitalOcean Droplet ($5/month)
- **Setup:** Node.js + PM2 + Nginx
- **Database:** MongoDB Atlas or self-hosted

**Option 3: Cloud Platform**
- **AWS:** EC2 + RDS
- **Google Cloud:** App Engine + Cloud SQL
- **Azure:** App Service + Cosmos DB

---

### 6. Testing Checklist

#### Backend Testing
- [ ] User can add transactions within limit
- [ ] User blocked when limit reached
- [ ] Monthly counter resets correctly
- [ ] Subscription expiry downgrades to free
- [ ] Usage stats API returns correct data
- [ ] Feature checks work for all tiers

#### Frontend Testing
- [ ] Usage counter displays correctly
- [ ] Progress bar updates in real-time
- [ ] Warning shows at 80% usage
- [ ] Limit reached message shows at 100%
- [ ] Upgrade button navigates to subscription page
- [ ] Unlimited plans show correctly

#### Payment Testing (Use Test Mode)
- [ ] Checkout session creates successfully
- [ ] Payment completes and redirects
- [ ] Webhook updates subscription status
- [ ] User gets access to premium features
- [ ] Subscription renewal works
- [ ] Cancellation works

---

### 7. Security Considerations

1. **Webhook Verification:**
   - Always verify Stripe/Razorpay webhook signatures
   - Don't trust client-side subscription status

2. **Feature Access:**
   - Always check subscription on backend
   - Never rely on frontend checks alone

3. **Rate Limiting:**
   - Already implemented in `rateLimiter.js`
   - Consider adding per-tier rate limits

4. **Data Protection:**
   - Encrypt payment information
   - PCI compliance if storing card data (use Stripe/Razorpay instead)

---

### 8. Monitoring & Analytics

**Track These Metrics:**
- Conversion rate (free → paid)
- Churn rate
- Average revenue per user (ARPU)
- Feature usage by tier
- Transaction limit hit rate

**Tools to Use:**
- Google Analytics for frontend
- Mixpanel/Amplitude for user behavior
- Stripe Dashboard for payment analytics
- Custom backend logging

---

## Quick Start Guide

### To Test Usage Limiting (Already Working):

1. **Start Backend:**
   ```bash
   cd finvoice-backend
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd finvoice-frontend
   npm install
   npm start
   ```

3. **Test Flow:**
   - Register/login as user
   - Add transactions (free tier = 50 limit)
   - Watch usage counter update
   - Try to add 51st transaction → should be blocked
   - Test upgrade endpoint:
     ```bash
     curl -X POST http://localhost:5000/api/subscription/upgrade \
       -H "Authorization: Bearer YOUR_TOKEN" \
       -H "Content-Type: application/json" \
       -d '{"plan": "monthly"}'
     ```

### To Add Payment Integration (Next Step):

1. Choose payment provider (Stripe or Razorpay)
2. Create account and get API keys
3. Implement payment routes (see section 1 above)
4. Create checkout flow in frontend
5. Set up webhook handling
6. Test with test cards

---

## Cost Estimates

### Monthly Operating Costs:

**Minimal Setup (Free Tier):**
- MongoDB Atlas: Free (512MB)
- Render.com Backend: Free
- Vercel Frontend: Free
- OpenAI API: ~$5-20 (pay per use)
- **Total: $5-20/month**

**Production Setup:**
- MongoDB Atlas: $9/month (2GB)
- Railway/Render Backend: $7/month
- Vercel Frontend: Free
- OpenAI API: $20-50/month
- Stripe/Razorpay: 2-3% per transaction
- **Total: $36-66/month + transaction fees**

**Scalable Setup:**
- DigitalOcean Droplet: $12/month
- MongoDB Atlas: $25/month (10GB)
- CDN (Cloudflare): Free
- OpenAI API: $50-100/month
- **Total: $87-137/month**

---

## Support & Maintenance

### Regular Tasks:
1. Monitor subscription expirations
2. Handle failed payments
3. Process refunds
4. Update pricing
5. Add new features
6. Fix bugs
7. Respond to support tickets

### Recommended Tools:
- Sentry for error tracking
- LogRocket for session replay
- Intercom for customer support
- Stripe Dashboard for payment management

---

## Next Steps Priority

1. **HIGH PRIORITY:**
   - [ ] Choose payment provider (Stripe or Razorpay)
   - [ ] Implement payment integration
   - [ ] Test payment flow end-to-end
   - [ ] Deploy to production

2. **MEDIUM PRIORITY:**
   - [ ] Add AI voice features
   - [ ] Implement report downloads
   - [ ] Add email notifications
   - [ ] Create admin dashboard

3. **LOW PRIORITY:**
   - [ ] Add analytics
   - [ ] Implement referral system
   - [ ] Add team/multi-user support
   - [ ] Create mobile app

---

## Questions to Answer Before Proceeding

1. **Payment Provider:** Stripe (international) or Razorpay (India-focused)?
2. **Hosting:** Free tier (Render/Vercel) or paid VPS?
3. **AI Features:** Which features to implement first?
4. **Pricing:** Keep current pricing or adjust?
5. **Launch Strategy:** Soft launch or full launch?

---

**Current Status:** ✅ Usage limiting system is complete and ready to test!

**Next Action:** Choose payment provider and implement payment integration.
