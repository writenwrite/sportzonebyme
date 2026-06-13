<![CDATA[<div align="center">

# 🚀 SPORTZONE DEPLOYMENT GUIDE

### Complete Production Deployment Instructions

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>

---

## 📑 Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Database Setup](#database-setup)
5. [AI Service Deployment](#ai-service-deployment)
6. [Environment Variables](#environment-variables)
7. [Domain & SSL](#domain--ssl)
8. [Post-Deployment](#post-deployment)

---

## Deployment Overview

### Recommended Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PRODUCTION DEPLOYMENT STACK                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   FRONTEND  │     │   BACKEND   │     │  DATABASE   │     │ AI SERVICE  │
│   (Vercel)  │────▶│ (Railway)   │────▶│ (Railway    │     │ (Railway/   │
│             │     │             │     │  PostgreSQL)│     │  Fly.io)    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  Static Assets      REST API           Persistent Data      LLM Processing
  CDN Global         Auto-scale         Automated Backups   GPU Support
```

### Deployment Options

| Component | Free Tier | Paid Option | Best For |
|-----------|-----------|-------------|----------|
| Frontend | Vercel | Netlify | Static React app |
| Backend | Railway | Render | Node.js API |
| Database | Railway | Supabase | PostgreSQL |
| AI Service | Fly.io | Replicate | Ollama/LLM |
| CDN | Cloudflare | AWS CloudFront | Global distribution |

---

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
# Initialize git repository
cd sportzone
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/sportzone.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `sportzone` repository

### Step 3: Configure Build Settings

```
Framework Preset:    Vite
Root Directory:      client
Build Command:       npm run build
Output Directory:    dist
Install Command:     npm install
```

### Step 4: Environment Variables

Add these environment variables in Vercel:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
VITE_WS_URL=wss://your-backend-url.railway.app
```

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `sportzone` repository
4. Select `server` as root directory

### Step 3: Add PostgreSQL Database

1. In your project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL instance

### Step 4: Configure Service

**Build Settings:**
```
Build Command:    npm install && npx prisma generate
Start Command:    npm start
```

**Environment Variables:**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${{PostgreSQL.DATABASE_URL}}
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.vercel.app
STRIPE_SECRET_KEY=sk_live_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
EASYPOST_API_KEY=your-easypost-key
WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_TOKEN=your-whatsapp-token
OLLAMA_BASE_URL=your-ollama-url
AI_MODEL=llama3.2
```

### Step 5: Deploy

Railway will automatically deploy when you push to GitHub.

### Step 6: Run Database Migrations

1. Go to your backend service
2. Open the Deploy tab
3. Add a custom deployment command:
```bash
npx prisma db push
```

### Step 7: Seed Database (Optional)

Run this command in Railway's shell:
```bash
npm run seed
```

---

## Database Setup

### Option 1: Railway PostgreSQL (Recommended)

Railway provides managed PostgreSQL with:
- Automatic backups
- Connection pooling
- Easy scaling

**Connection String Format:**
```
postgresql://username:password@host:port/database
```

### Option 2: Supabase (Free Tier)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database

**Connection String Format:**
```
postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
```

### Option 3: Neon (Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy connection string

---

## AI Service Deployment

### Option 1: Railway (with GPU)

1. Create new service in Railway
2. Set root directory to `ai-service`
3. Add Python buildpack
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Option 2: Fly.io (with GPU)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
cd ai-service
fly launch

# Deploy
fly deploy
```

**fly.toml configuration:**
```toml
app = "sportzone-ai"
primary_region = "sjc"

[build]
  builder = "paketobuildpacks/builder:base"

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[env]
  OLLAMA_BASE_URL = "http://ollama:11434"
  AI_MODEL = "llama3.2"

[[services]]
  protocol = "tcp"
  internal_port = 11434
  [services.concurrency]
    type = "connections"
    hard_limit = 100
    soft_limit = 80
```

### Option 3: Self-Hosted Ollama

For production, self-host Ollama on a GPU server:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull model
ollama pull llama3.2

# Start server
ollama serve
```

---

## Environment Variables

### Complete Environment Reference

```env
# ═══════════════════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════════════════
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# ═══════════════════════════════════════════════════════════════
# AUTHENTICATION
# ═══════════════════════════════════════════════════════════════
JWT_SECRET="your-256-bit-secret-key"
JWT_EXPIRES_IN="7d"

# ═══════════════════════════════════════════════════════════════
# CLIENT URL
# ═══════════════════════════════════════════════════════════════
CLIENT_URL="https://yourdomain.com"

# ═══════════════════════════════════════════════════════════════
# STRIPE PAYMENT
# ═══════════════════════════════════════════════════════════════
STRIPE_SECRET_KEY="sk_live_xxxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxxx"

# ═══════════════════════════════════════════════════════════════
# EASYPOST SHIPPING
# ═══════════════════════════════════════════════════════════════
EASYPOST_API_KEY="xxxxx_xxxxxxxxxxxxx"

# ═══════════════════════════════════════════════════════════════
# WHATSAPP BUSINESS API
# ═══════════════════════════════════════════════════════════════
WHATSAPP_API_URL="https://graph.facebook.com/v18.0/YOUR_PHONE_ID/messages"
WHATSAPP_TOKEN="your-whatsapp-token"

# ═══════════════════════════════════════════════════════════════
# AI SERVICE
# ═══════════════════════════════════════════════════════════════
OLLAMA_BASE_URL="https://your-ollama-service.fly.dev"
AI_MODEL="llama3.2"

# ═══════════════════════════════════════════════════════════════
# FRONTEND (VITE)
# ═══════════════════════════════════════════════════════════════
VITE_API_URL="https://your-backend.railway.app/api"
VITE_WS_URL="wss://your-backend.railway.app"

# ═══════════════════════════════════════════════════════════════
# SERVER
# ═══════════════════════════════════════════════════════════════
NODE_ENV="production"
PORT=3001
```

---

## Domain & SSL

### Cloudflare Setup (Recommended)

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Enable SSL/TLS:
   - Mode: Full (Strict)
   - Always Use HTTPS: ON
   - Auto Minify: ON

### DNS Records

```
Type    Name    Content                   Proxy
─────────────────────────────────────────────────
A       @       76.76.21.21               ✅ Proxied
CNAME   www     your-domain.com           ✅ Proxied
CNAME   api     your-backend.railway.app  ✅ Proxied
```

---

## Post-Deployment

### 1. Verify All Services

```bash
# Check frontend
curl https://yourdomain.com

# Check backend API
curl https://yourdomain.com/api/health

# Check AI service
curl https://your-ai-service.fly.dev/health
```

### 2. Create Admin User

```bash
# Connect to Railway shell
railway login
railway shell

# Run seed script
npm run seed

# Admin credentials
# Email: admin@sportzone.com
# Password: admin123
```

### 3. Configure Stripe Webhook

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Test WhatsApp Notifications

```bash
# Test WhatsApp API
curl -X POST https://yourdomain.com/api/test-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "message": "Test notification"}'
```

---

## Monitoring & Logs

### Railway Logs

```bash
# View logs
railway logs

# Follow logs
railway logs --follow
```

### Vercel Analytics

1. Go to Vercel Dashboard → Analytics
2. Enable Web Vitals tracking
3. Monitor performance metrics

### Uptime Monitoring

Use [UptimeRobot](https://uptimerobot.com) or [Better Uptime](https://betterstack.com):
- Monitor: `https://yourdomain.com/api/health`
- Interval: 5 minutes
- Alert: Email + Slack

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Check `CLIENT_URL` env var |
| Database Connection | Verify `DATABASE_URL` format |
| JWT Invalid | Regenerate `JWT_SECRET` |
| Stripe Failed | Verify webhook secret |
| AI Timeout | Check Ollama service status |

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
DEBUG=sportzone:*
```

---

<div align="center">

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>
]]>