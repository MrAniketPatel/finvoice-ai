# 🤖 OpenAI Integration Setup Guide

## ✅ What's Been Implemented:

### Backend:
- ✅ OpenAI package installed
- ✅ `/api/ai/transcribe` - Whisper voice-to-text (Quarterly+ plan)
- ✅ `/api/ai/insights` - GPT-3.5 financial insights (Yearly plan)
- ✅ `/api/ai/categorize` - Smart transaction categorization (Yearly plan)
- ✅ Subscription tier checks integrated
- ✅ Error handling for missing API key

### Frontend:
- ✅ PremiumModal component for upgrade prompts
- ✅ API endpoints configured
- ✅ Premium badges and styling

---

## 🔑 Setup Steps:

### 1. Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. **Important**: Add $5-10 credits at https://platform.openai.com/account/billing

### 2. Add API Key to Render

1. Go to Render dashboard → Your backend service
2. Click **Environment** tab
3. Add new variable:
   ```
   Key: OPENAI_API_KEY
   Value: sk-your-actual-key-here
   ```
4. Click **Save Changes** (auto-redeploys)

### 3. Test the Features

After deployment, test with a Yearly subscription user:

**Test Whisper Transcription:**
```bash
curl -X POST https://fin-voice-backend.onrender.com/api/ai/transcribe \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"audioBase64": "BASE64_AUDIO_DATA"}'
```

**Test GPT Insights:**
```bash
curl -X POST https://fin-voice-backend.onrender.com/api/ai/insights \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 💰 Pricing Estimates:

### Whisper API:
- **Cost**: $0.006 per minute of audio
- **Example**: 100 voice transactions/month = ~5 minutes = $0.03/month

### GPT-3.5 Turbo:
- **Cost**: $0.002 per 1K tokens (~750 words)
- **Example**: 50 insight requests/month = ~$0.10/month

**Total**: ~$0.15-0.50 per user per month (very affordable!)

---

## 🎯 Feature Access by Plan:

| Feature | Free | Monthly | Quarterly | Yearly |
|---------|------|---------|-----------|--------|
| Basic Transactions | ✅ | ✅ | ✅ | ✅ |
| Reports & Alerts | ❌ | ✅ | ✅ | ✅ |
| AI Voice (Whisper) | ❌ | ❌ | ✅ | ✅ |
| GPT-3.5 Insights | ❌ | ❌ | ❌ | ✅ |
| Smart Categorization | ❌ | ❌ | ❌ | ✅ |

---

## 🔧 Next Steps to Complete Integration:

### 1. Update Voice Components (Optional)
Currently using browser speech API. To use Whisper:
- Capture audio as blob
- Convert to base64
- Send to `/api/ai/transcribe`
- Use returned text

### 2. Add GPT Insights Button
Add a button in dashboard to fetch AI insights:
```javascript
const fetchAIInsights = async () => {
  const res = await fetch(API_ENDPOINTS.AI.INSIGHTS, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  // Display insights
};
```

### 3. Test Subscription Restrictions
- Try accessing AI features with Free plan → Should show PremiumModal
- Upgrade to Quarterly → Whisper should work
- Upgrade to Yearly → All AI features should work

---

## 🚨 Important Notes:

1. **API Key Security**: Never commit API key to git! Only add to Render environment variables
2. **Rate Limiting**: OpenAI has rate limits. Monitor usage at platform.openai.com
3. **Error Handling**: Backend gracefully handles missing API key
4. **Cost Monitoring**: Set up billing alerts in OpenAI dashboard

---

## 📊 Monitoring Usage:

Check OpenAI usage at: https://platform.openai.com/usage

Set up billing alerts:
1. Go to https://platform.openai.com/account/billing/limits
2. Set monthly budget limit (e.g., $10)
3. Enable email notifications

---

## ✅ Verification Checklist:

- [ ] OpenAI API key obtained
- [ ] API key added to Render environment variables
- [ ] Backend redeployed successfully
- [ ] Test user upgraded to Quarterly/Yearly plan
- [ ] AI endpoints return responses (not 503 errors)
- [ ] Free users see "Upgrade Required" modal
- [ ] Premium users can access AI features

---

## 🆘 Troubleshooting:

**503 Error "AI service not configured"**
- API key not set in Render environment variables
- Restart backend service after adding key

**403 Error "Feature not available"**
- User doesn't have required subscription tier
- Check user's subscriptionTier in database

**500 Error from OpenAI**
- Check API key is valid
- Verify you have credits in OpenAI account
- Check OpenAI status: https://status.openai.com

---

Need help? Check the OpenAI docs: https://platform.openai.com/docs
