#!/bin/bash
# Generate secure secrets and verify deployment readiness

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  EMAR DEPLOYMENT HELPER - GENERATE SECRETS     ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Generate JWT Secret
echo "📝 Generating JWT_SECRET (32-byte random string)..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ JWT_SECRET = $JWT_SECRET"
echo ""

# Generate Encryption Key
echo "📝 Generating ENCRYPTION_KEY (32-byte random string)..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ ENCRYPTION_KEY = $ENCRYPTION_KEY"
echo ""

echo "╔════════════════════════════════════════════════╗"
echo "║  ENVIRONMENT VARIABLES FOR VERCEL              ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

echo "👇 Copy the following values into Vercel Dashboard:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Variable Name: NODE_ENV"
echo "Value:        production"
echo ""
echo "Variable Name: JWT_SECRET"
echo "Value:        $JWT_SECRET"
echo ""
echo "Variable Name: ENCRYPTION_KEY"
echo "Value:        $ENCRYPTION_KEY"
echo ""
echo "Variable Name: MONGO_URI"
echo "Value:        mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/emar"
echo "Note:         Replace USERNAME and PASSWORD with your MongoDB credentials"
echo ""
echo "Variable Name: CORS_ORIGIN"
echo "Value:        https://YOUR_FRONTEND_URL.vercel.app"
echo "Note:         You'll get this after first deployment"
echo ""
echo "Variable Name: VITE_API_URL"  
echo "Value:        https://YOUR_BACKEND_URL.vercel.app/api"
echo "Note:         You'll get this after first deployment"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  DEPLOYMENT CHECKLIST                          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check Git
echo -n "✓ Git repository: "
if git rev-parse --git-dir > /dev/null 2>&1; then
  echo "✅"
else
  echo "❌ Not a git repo"
fi

# Check files
echo -n "✓ Root vercel.json: "
[ -f "vercel.json" ] && echo "✅" || echo "❌"

echo -n "✓ Backend vercel.json: "
[ -f "backend/vercel.json" ] && echo "✅" || echo "❌"

echo -n "✓ Frontend vercel.json: "
[ -f "frontend/vercel.json" ] && echo "✅" || echo "❌"

# Check dependencies
echo -n "✓ Backend express: "
grep -q '"express"' backend/package.json && echo "✅" || echo "❌"

echo -n "✓ Backend mongoose: "
grep -q '"mongoose"' backend/package.json && echo "✅" || echo "❌"

echo -n "✓ Frontend react: "
grep -q '"react"' frontend/package.json && echo "✅" || echo "❌"

echo -n "✓ Frontend vite: "
grep -q '"vite"' frontend/package.json && echo "✅" || echo "❌"

# Check git remote
echo -n "✓ Git remote configured: "
if git remote -v | grep -q "origin"; then
  echo "✅"
else
  echo "❌"
fi

# Check uncommitted changes
echo -n "✓ All changes committed: "
if [ -z "$(git status -s)" ]; then
  echo "✅"
else
  echo "❌ ($(git status -s | wc -l) files uncommitted)"
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  NEXT STEPS TO DEPLOY                          ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

echo "1️⃣  Commit your changes:"
echo "    git add ."
echo "    git commit -m 'Prepare for Vercel deployment'"
echo "    git push origin main"
echo ""

echo "2️⃣  Go to https://vercel.com"
echo "    - Click 'Add New Project'"
echo "    - Select your GitHub repository"
echo "    - Click 'Deploy'"
echo ""

echo "3️⃣  Set Environment Variables in Vercel Dashboard"
echo "    Copy the values shown above"
echo "    Paste into Project Settings → Environment Variables"
echo ""

echo "4️⃣  Redeploy the failed deployment"
echo "    Go to Deployments tab"
echo "    Click 'Redeploy' button"
echo ""

echo "5️⃣  Test your deployment"
echo "    Visit your Frontend URL in browser"
echo "    Test login with credentials"
echo ""

echo "✨ Good luck! Your app will be live soon! ✨"
echo ""
