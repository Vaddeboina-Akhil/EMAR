#!/bin/bash
# EMAR VERCEL DEPLOYMENT CHECKLIST

echo "================================"
echo "EMAR DEPLOYMENT VERIFICATION"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_item() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓${NC} $2"
  else
    echo -e "${RED}✗${NC} $2"
  fi
}

echo "--- CHECKING CODE STRUCTURE ---"
echo ""

# Check if vercel.json exists
[ -f "vercel.json" ] && check_item 0 "Root vercel.json exists" || check_item 1 "Root vercel.json missing"

# Check backend vercel.json
[ -f "backend/vercel.json" ] && check_item 0 "Backend vercel.json exists" || check_item 1 "Backend vercel.json missing"

# Check frontend vercel.json
[ -f "frontend/vercel.json" ] && check_item 0 "Frontend vercel.json exists" || check_item 1 "Frontend vercel.json missing"

# Check backend package.json
[ -f "backend/package.json" ] && check_item 0 "Backend package.json exists" || check_item 1 "Backend package.json missing"

# Check frontend package.json
[ -f "frontend/package.json" ] && check_item 0 "Frontend package.json exists" || check_item 1 "Frontend package.json missing"

# Check git status
git rev-parse --git-dir > /dev/null 2>&1 && check_item 0 "Git repository initialized" || check_item 1 "Git repository not found"

echo ""
echo "--- CHECKING CONFIGURATION ---"
echo ""

# Check .env.example exists
[ -f "backend/.env.example" ] && check_item 0 ".env.example exists" || check_item 1 ".env.example missing"

# Check .env.production exists
[ -f ".env.production" ] && check_item 0 ".env.production template exists" || check_item 1 ".env.production missing"

# Check if backend has necessary dependencies
grep -q "mongoose" backend/package.json && check_item 0 "MongoDB driver configured" || check_item 1 "MongoDB driver missing"

grep -q "jsonwebtoken" backend/package.json && check_item 0 "JWT library configured" || check_item 1 "JWT library missing"

grep -q "express" backend/package.json && check_item 0 "Express.js configured" || check_item 1 "Express missing"

# Check if frontend has React
grep -q "react" frontend/package.json && check_item 0 "React configured" || check_item 1 "React missing"

grep -q "vite" frontend/package.json && check_item 0 "Vite bundler configured" || check_item 1 "Vite missing"

echo ""
echo "--- GIT STATUS ---"
echo ""

# Check if git remote is set
git remote -v | grep -q "." && check_item 0 "Git remote configured" || check_item 1 "Git remote not configured"

# Count uncommitted changes
uncommitted=$(git status -s | wc -l)
if [ $uncommitted -eq 0 ]; then
  check_item 0 "All changes committed"
else
  check_item 1 "Uncommitted changes: $uncommitted files"
fi

echo ""
echo "--- DEPLOYMENT READINESS ---"
echo ""

# Summary
echo -e "${YELLOW}BEFORE DEPLOYING:${NC}"
echo ""
echo "1. Verify all checks above pass (fix any ✗ marks)"
echo ""
echo "2. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy to Vercel'"
echo "   git push origin main"
echo ""
echo "3. Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Set environment variables"
echo "   - Deploy"
echo ""
echo "4. Set Environment Variables in Vercel Dashboard:"
echo "   MONGO_URI=mongodb+srv://..."
echo "   JWT_SECRET=your-secret-key"
echo "   ENCRYPTION_KEY=your-encryption-key"
echo "   CORS_ORIGIN=https://your-frontend.vercel.app"
echo "   VITE_API_URL=https://your-backend.vercel.app/api"
echo ""
echo "5. After deployment, test:"
echo "   - Frontend loads at vercel domain"
echo "   - Login page appears"
echo "   - API calls reach backend (check DevTools Network tab)"
echo ""
echo -e "${GREEN}Ready to deploy!${NC}"
echo ""
