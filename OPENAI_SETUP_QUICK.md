# OpenAI API Setup - Quick Guide

## Step 1: Create OpenAI Account
1. Go to: https://platform.openai.com/signup
2. Sign up with email or Google
3. Verify your email

## Step 2: Add Payment Method
1. Go to: https://platform.openai.com/account/billing/overview
2. Click "Add payment method"
3. Add credit/debit card
4. **Set usage limit**: $5 or $10/month (recommended)

## Step 3: Get API Key
1. Go to: https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it: "FinVoice Production"
4. Copy the key (starts with `sk-...`)
5. **IMPORTANT**: Save it somewhere safe - you can't see it again!

## Step 4: Add to Render
1. Go to: https://dashboard.render.com
2. Select your backend service: `fin-voice-backend`
3. Click "Environment" in left sidebar
4. Click "Add Environment Variable"
5. Key: `OPENAI_API_KEY`
6. Value: `sk-proj-...` (paste your key)
7. Click "Save Changes"
8. Render will automatically redeploy (~2 minutes)

## Step 5: Test
1. Open: https://finvoice-ai-kappa.vercel.app
2. Login with Quarterly/Yearly account
3. Click voice button
4. Speak: "Add expense 500 for food"
5. Should work! ✅

## Cost Monitoring
- Check usage: https://platform.openai.com/usage
- View bills: https://platform.openai.com/account/billing/overview
- Set alerts: https://platform.openai.com/account/limits

## Free Credits
- New accounts get **$5 free credits** (3 months)
- Enough for ~16,000 voice commands
- Perfect for testing and initial launch

## Pricing
- **Whisper**: $0.006/minute (~$0.0005 per 5-second command)
- **GPT-3.5**: $0.50 per 1M input tokens
- **Estimated**: $0.25-$2.50/month for small app

## Safety Tips
✅ Set monthly spending limit ($5-10)
✅ Monitor usage weekly
✅ Never commit API key to GitHub
✅ Use environment variables only
✅ Rotate key if exposed

## Troubleshooting

### "AI service not configured"
- API key not set in Render
- Go to Render → Environment → Add OPENAI_API_KEY

### "Insufficient quota"
- Free credits expired or limit reached
- Add payment method or increase limit

### "Invalid API key"
- Key is wrong or expired
- Generate new key and update in Render

---

**Ready to go!** 🚀

Total setup time: ~5 minutes
