# 🚀 The Candle Lab — Comprehensive Deployment Guide

This guide covers deploying both the **React Vite Frontend** and the **Laravel 11 Backend** (with Supabase PostgreSQL).

---

## 🛠 Recommended Architecture

| Component | Stack | Recommended Hosting Platform | Free Tier / Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + TypeScript | **Vercel** or **Netlify** | 100% Free |
| **Backend** | Laravel 11 (PHP 8.2) | **Render**, **Railway**, or **Fly.io** | Free / $5/mo |
| **Database** | PostgreSQL | **Supabase** (Already Connected) | Free |

---

## 🌐 1. Deploying Frontend to Vercel (Recommended)

### Step 1: Connect Repository to Vercel
1. Go to [vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New Project** → Import your repository.
3. Set **Root Directory** to `frontend`.

### Step 2: Configure Build Settings
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 3: Set Environment Variables on Vercel
Add the following under **Environment Variables**:
```env
VITE_API_BASE_URL=https://your-backend-render-app.onrender.com/api
VITE_GOOGLE_CLIENT_ID=730161262814-p3cs07la1cstaq7l18umcmrngd66o7o4.apps.googleusercontent.com
VITE_RAZORPAY_KEY_ID=rzp_test_TJQHhC34WyD6WT
```

### Step 4: Click Deploy
Vercel will build and assign your site a custom domain (e.g. `https://thecandlelab.vercel.app`).

---

## ⚙️ 2. Deploying Backend (Laravel 11) to Render / Railway

### Option A: Render (Web Service)
1. Go to [render.com](https://render.com) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `PHP` (or `Docker`)
   - **Build Command**: `composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache`
   - **Start Command**: `php artisan serve --host=0.0.0.0 --port=10000`
4. Add **Environment Variables** in Render:
```env
APP_NAME="The Candle Lab"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:X8vB3z9+9Z0lK4a6R2w8T1y5U7i0O2p4S6d8F0g2H4j=
APP_URL=https://your-backend-render-app.onrender.com
DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-northeast-2.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.anaqrvrzbqhpgwjfpacx
DB_PASSWORD="Thecandlelab@6264885453"
SUPABASE_URL=https://anaqrvrzbqhpgwjfpacx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RAZORPAY_KEY_ID=rzp_test_TJQHhC34WyD6WT
RAZORPAY_KEY_SECRET=VWxlYLJUiCFvp9eWaDIoIxlU
FRONTEND_URL=https://thecandlelab.vercel.app
SANCTUM_STATEFUL_DOMAINS=thecandlelab.vercel.app
```

---

## 🐳 3. Docker Single-Server / VPS Deployment

If deploying to Hostinger / DigitalOcean / AWS EC2 using Docker:

```bash
# 1. Clone repository on VPS
git clone <your-repo-url>
cd thecandlelab

# 2. Build and start containers in detached mode
docker-compose up -d --build

# 3. Run Laravel migrations inside container
docker-compose exec web php artisan migrate --force
```

---

## ⚡ 4. Local Testing Server Launcher

To run both backend and frontend locally for testing before deployment:

### Start Backend (Port 8085):
```powershell
.\START-BACKEND.ps1
```

### Start Frontend (Port 5173):
```powershell
cd frontend
npm run dev
```
