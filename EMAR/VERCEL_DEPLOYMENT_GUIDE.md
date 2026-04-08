# VERCEL DEPLOYMENT GUIDE FOR EMAR

## Step 1: Push Code to GitHub
Make sure your code is committed and pushed to GitHub:
```bash
cd C:\Users\akhil\Downloads\EMAR\EMAR
git add .
git commit -m "Vercel deployment setup"
git push origin main
```

## Step 2: Create Vercel Projects
You have two options:

### OPTION A: Single Project (Monorepo) - RECOMMENDED
1. Go to https://vercel.com
2. Click "Add New Project"
3. Select your GitHub repository
4. Keep "Framework Preset" as "Other"
5. Set "Root Directory" to "./" (root)
6. Click "Deploy"

### OPTION B: Separate Projects (Backend + Frontend)
Create two separate Vercel projects:
- One for backend (server.js)
- One for frontend (React app)

## Step 3: Configure Environment Variables in Vercel Dashboard

### For Backend Service:
Go to Vercel Dashboard → Project Settings → Environment Variables

Add these variables:

```
NODE_ENV = production
PORT = 3000
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/emar
JWT_SECRET = your-super-secret-jwt-key-here-make-it-long-and-random-min-32-chars
ENCRYPTION_KEY = your-32-byte-encryption-key-here-must-be-32-bytes

# Blockchain (Optional)
BLOCKCHAIN_RPC_URL = https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY = your-wallet-private-key-here
CONTRACT_ADDRESS = your-deployed-contract-address

# CORS Configuration
CORS_ORIGIN = https://your-frontend-domain.vercel.app

# AI/APIs (Optional)
AI_API_KEY = your-api-key-here
```

### For Frontend Service:
```
VITE_API_URL = https://your-backend-domain.vercel.app/api
```

## Step 4: Database Setup

### MongoDB Atlas (Recommended)
1. Create account at https://mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Add IP Whitelist: 0.0.0.0/0 (for Vercel IPs)
4. Create database user with strong password
5. Copy connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
6. Add to MONGO_URI environment variable

### Important: Ensure MongoDB Whitelist
```
Go to MongoDB Atlas → Network Access
Add entry: 0.0.0.0/0 (allows all Vercel IPs)
```

## Step 5: Verify Configuration

After deployment:

### Test Backend Health
```
curl https://your-backend-domain.vercel.app/api/health
Expected: {"status":"OK"}
```

### Test Frontend
```
Open https://your-frontend-domain.vercel.app
Should load the login page
```

### Test API Connection
1. Open frontend login page
2. Inspect Network tab in DevTools
3. Try to login - check if API requests reach backend
4. Check CORS headers in response

## Step 6: Troubleshooting

### CORS Errors
If you see CORS errors:
1. Update CORS_ORIGIN in backend environment variables
2. Redeploy backend
3. Clear browser cache and try again

### MongoDB Connection Issues
1. Check MONGO_URI is correct
2. Verify database user credentials
3. Ensure IP whitelist includes 0.0.0.0/0
4. Check network connectivity from Vercel

### Frontend Can't Reach Backend
1. Update VITE_API_URL to correct backend domain
2. Rebuild and redeploy frontend
3. Check Network tab in DevTools for actual API calls

### 404 on Frontend Routes
This should be fixed by the routing config in vercel.json
If still issues:
1. Delete dist folder and rebuild
2. Redeploy

## Step 7: Custom Domain Setup (Optional)

1. Go to Vercel Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., emar.yourdomain.com)
4. Add DNS records at your domain registrar
5. Verify domain

## Step 8: SSL/TLS Certificates

Vercel automatically provisions Let's Encrypt SSL certificates for:
- vercel.app domains (automatic)
- Custom domains (automatic)

No action needed!

## Step 9: Monitoring

### Check Deployment Status
- Go to Vercel Dashboard
- Click on project
- View "Deployments" tab
- Check build logs if issues

### Monitor API Usage
- Check MongoDB Atlas dashboard for connection stats
- Monitor Vercel function invocations in Analytics

### Error Tracking
- Check Vercel Build & Function logs
- Set up external error tracking (e.g., Sentry, LogRocket)

## Step 10: Redeploy After Changes

Any push to main branch will automatically trigger redeploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Wait 1-2 minutes for automatic deployment to complete.

---

## ENVIRONMENT VARIABLES SUMMARY

### Required for Backend:
- MONGO_URI (MongoDB connection string)
- JWT_SECRET (at least 32 random characters)
- NODE_ENV (set to "production")

### Required for Frontend:
- VITE_API_URL (your deployed backend URL)

### Optional (but recommended):
- CORS_ORIGIN (frontend URL)
- ENCRYPTION_KEY (for data encryption)
- Blockchain settings (if using blockchain features)
- AI API keys (if using AI features)

---

## QUICK REFERENCE

| Component | Platform | Domain | Environment |
|-----------|----------|--------|-------------|
| Frontend | Vercel | frontend-*.vercel.app | VITE_API_URL=backend URL |
| Backend | Vercel | api-*.vercel.app | MONGO_URI, JWT_SECRET |
| Database | MongoDB Atlas | mongodb.net | Cloud service |

---

## NEXT STEPS

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Monitor first deployment
4. Test login flow end-to-end
5. Set up custom domains if needed
6. Enable analytics and monitoring

For help: https://vercel.com/docs
