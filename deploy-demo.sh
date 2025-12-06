#!/bin/bash

echo "🚀 FinVoice.AI - Quick Demo Deployment"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - FinVoice.AI"
    echo "✅ Git initialized"
    echo ""
    echo "⚠️  Next steps:"
    echo "1. Create a new repo on GitHub: https://github.com/new"
    echo "2. Run: git remote add origin YOUR_REPO_URL"
    echo "3. Run: git push -u origin main"
    echo "4. Then run this script again"
    exit 0
fi

# Check if remote exists
if ! git remote | grep -q origin; then
    echo "⚠️  No git remote found!"
    echo "Please add your GitHub repo:"
    echo "git remote add origin YOUR_REPO_URL"
    exit 1
fi

echo "📤 Pushing to GitHub..."
git add .
git commit -m "Update: Ready for demo deployment"
git push origin main
echo "✅ Pushed to GitHub"
echo ""

# Deploy frontend to GitHub Pages
echo "🌐 Deploying frontend to GitHub Pages..."
cd finvoice-frontend

# Check if gh-pages is installed
if ! npm list gh-pages > /dev/null 2>&1; then
    echo "📦 Installing gh-pages..."
    npm install --save-dev gh-pages
fi

# Deploy
npm run deploy

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📍 Your demo should be live at:"
echo "https://YOUR_USERNAME.github.io/finvoice-ai"
echo ""
echo "⏰ Wait 2-3 minutes for GitHub Pages to update"
echo ""
echo "📝 Next steps:"
echo "1. Go to your repo → Settings → Pages"
echo "2. Verify source is set to 'gh-pages' branch"
echo "3. Visit your demo URL"
echo ""
echo "⚠️  Note: Backend features won't work on GitHub Pages"
echo "For full demo with backend, use Vercel + Render (see GITHUB_DEMO_DEPLOYMENT.md)"
