# ⚡ EMAR VERCEL DEPLOYMENT - QUICK START GUIDE

## STEP 1: Prepare Your Code (5 minutes)

```bash
# Navigate to project root
cd C:\Users\akhil\Downloads\EMAR\EMAR

# Verify all files are present
dir vercel.json          # Root config
dir backend\vercel.json  # Backend config
dir frontend\vercel.json # Frontend config
dir backend\.env.example # Example env
dir .env.production      # Production env template

# Check git status (all files should be committed)
git status

# If there are uncommitted changes, commit them
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## STEP 2: Create Vercel Account & Link Repository (10 minutes)

### Visit https://vercel.com

1. **Sign Up / Login**
   - If new: Click "Sign Up → Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Import Project**
   - Click "Add New Project"
   - Find and select your EMAR repository
   - Click "Import"

3. **Configure Project**
   - **Project Name:** emar (or your choice)
   - **Framework:** Other (custom monorepo)
   - **Root Directory:** ./ (leave as root)
   - **Build Command:** Leave empty (using vercel.json)
   - **Output Directory:** Leave empty (using vercel.json)
   - Click **"Deploy"**

This will trigger your first build (will fail, that's normal - we need env vars)

---

## STEP 3: Configure Environment Variables (5 minutes)

### For the Backend:

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables (click "Add" for each):

```
NODE_ENV                = production
MONGO_URI               = mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/emar
JWT_SECRET              = YOUR_RANDOM_SECRET_KEY_MIN_32_CHARS
ENCRYPTION_KEY          = YOUR_32_BYTE_ENCRYPTION_KEY
CORS_ORIGIN             = https://your-PROJECTNAME.vercel.app
```

**How to generate secure strings:**
```bash
# Generate JWT_SECRET (in any terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output → paste as JWT_SECRET value

# Do the same for ENCRYPTION_KEY
```

**How to get MONGO_URI:**
1. Go to https://mongodb.com/cloud/atlas
2. Create free account or login
3. Create a cluster (M0 free tier)
4. Wait 5 minutes for cluster to deploy
5. Click "Connect" → "Drivers" → "Node.js"
6. Copy the connection string
7. Replace `<username>` and `<password>` with your database user credentials
8. Paste as MONGO_URI

**Important:** Add IP to MongoDB Whitelist
- MongoDB Atlas → Security → Network Access
- Click "Add IP Address"
- Enter **0.0.0.0/0** (allows all IPs for Vercel)
- Confirm

### For the Frontend:

Same location, add:
```
VITE_API_URL = https://YOUR_BACKEND_URL.vercel.app/api
```

(You'll get the actual URL after backend deploys first)

---

## STEP 4: Trigger Deployment (2 minutes)

Once environment variables are set:

1. Go to **Deployments** tab
2. Find the failed deployment (from STEP 2)
3. Click **"Redeploy"** button
4. Wait 3-5 minutes for deployment to complete

**Monitor build:**
- Click on the deployment
- Watch the build logs
- Look for "Deployment successful" message

---

## STEP 5: Get Your URLs (1 minute)

After successful build:

1. **Frontend URL:** Shown in Deployments tab
   - Example: `https://emar-gamma.vercel.app`

2. **Backend URL:** Also in Deployments (or Domains tab)
   - Example: `https://emar-backend-gamma.vercel.app`

---

## STEP 6: Update Frontend API URL (2 minutes)

Now that you have the backend URL:

1. Go back to Vercel Settings → Environment Variables
2. Update `VITE_API_URL` with your actual backend URL
3. Redeploy frontend

**OR** Update in frontend/.env.production:
```
VITE_API_URL=https://YOUR_EXACT_BACKEND_URL/api
```

Then push to git and it will auto-redeploy.

---

## STEP 7: Test Your Deployment (5 minutes)

### Test Backend:

Open browser and visit:
```
https://YOUR_BACKEND_URL/api/health
```

Should see:
```json
{"status":"OK"}
```

### Test Frontend:

Open browser and visit:
```
https://YOUR_FRONTEND_URL/
```

Should see: EMAR Login Page

### Test Full Login Flow:

1. Open Frontend URL
2. Open DevTools (F12) → Network tab
3. Try to login with test credentials
4. Watch Network tab - should see API calls to backend

If you see CORS errors:
- backend CORS_ORIGIN is wrong
- Update it and redeploy backend

---

## STEP 8: Monitor & Maintain (Ongoing)

### Access Logs & Errors:
- Vercel Dashboard → Deployments → Click deployment
- See build logs and function logs

### Auto-Deploy on Push:
Any git push automatically triggers redeploy:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Wait 2-3 minutes, will auto-deploy
```

### Health Checks:
Regularly test:
```bash
# Test backend health
curl https://YOUR_BACKEND_URL/api/health

# Test frontend loads
curl https://YOUR_FRONTEND_URL/
```

---

## TROUBLESHOOTING

### Build Fails
- Check Vercel build logs (Deployments tab)
- Common issues:
  - Missing npm dependencies
  - Wrong environment variables
  - Syntax errors in code

**Solution:** Fix the issue locally, push to git, and redeploy

### API calls fail (CORS error)
- Backend is blocking requests
- Fix CORS_ORIGIN environment variable
- Make sure it matches your frontend URL exactly

### Login doesn't work
- Check if JWT_SECRET is set
- Check if MONGO_URI is correct
- Verify MongoDB whitelist includes 0.0.0.0/0
- Check backend logs in Vercel

### Database connection fails
- MongoDB Whitelist issue (add 0.0.0.0/0)
- Wrong credentials in MONGO_URI
- Database credentials don't match user creation
- Network connectivity issues

---

## QUICK REFERENCE

| What | Where | Value |
|------|-------|-------|
| Frontend | Vercel Project 1 | https://emar-frontend.vercel.app |
| Backend | Vercel Project 2 | https://emar-backend.vercel.app |
| Database | MongoDB Atlas | mongodb.net connection string |
| Frontend Env | VITE_API_URL | Backend URL/api |
| Backend Env | MONGO_URI | MongoDB connection string |

---

## FINAL CHECKLIST

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Backend health check returns {"status":"OK"}
- [ ] Frontend loads at your Vercel URL
- [ ] Login page appears
- [ ] API calls reach backend (no CORS errors)
- [ ] Can login with test user

---

## NEED HELP?

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://mongodb.com/cloud/atlas
- Chat with Vercel Support: https://vercel.com/support

---

**Deployment Time: ~30 minutes total**
**Difficulty: Beginner-Friendly**
**Cost: Free (Vercel + MongoDB Free Tier)**
