# Luul E-commerce Deployment Guide

## 🗄️ Database Setup

### Current: SQLite (Development)
- ✅ Working locally with `prisma/dev.db`
- ✅ All migrations applied
- ✅ Data seeded

### Production Options:

#### Option 1: PostgreSQL (Recommended)
```bash
# 1. Update schema for production
# Change in prisma/schema.prisma:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

# 2. Set environment variable
DATABASE_URL="postgresql://username:password@localhost:5432/luul_db"

# 3. Deploy to providers:
# - Supabase (Free tier: 500MB)
# - Railway (Free tier: 1GB) 
# - Neon (Free tier: 3GB)
# - PlanetScale (Free tier: 5GB)
```

#### Option 2: Keep SQLite (Simple)
```bash
# For simple deployment, keep SQLite
# Just upload the prisma/dev.db file
```

## 🌐 Hosting Options

### Option 1: Vercel (Recommended)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL
```

### Option 2: Netlify
```bash
# 1. Build the project
npm run build

# 2. Deploy to Netlify
# Upload the 'out' folder
```

### Option 3: Railway
```bash
# 1. Connect GitHub repo to Railway
# 2. Railway auto-detects Next.js
# 3. Add environment variables
```

## 🔧 Environment Variables Needed

```env
# Database
DATABASE_URL="your_database_url"

# NextAuth
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="https://your-domain.com"

# Email (for OTP)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your_email@gmail.com"
EMAIL_SERVER_PASSWORD="your_app_password"
EMAIL_FROM="noreply@your-domain.com"
```

## 📦 Build Commands

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run migrations
npx prisma migrate deploy

# 3. Seed database
npx prisma db seed

# 4. Build for production
npm run build
```

## 🚀 Quick Deploy Steps

### For Vercel + Supabase:
1. Create Supabase project
2. Get DATABASE_URL from Supabase
3. Push to GitHub
4. Connect repo to Vercel
5. Add environment variables in Vercel
6. Deploy!

### For Railway (All-in-one):
1. Push to GitHub
2. Connect repo to Railway
3. Railway auto-deploys
4. Add PostgreSQL addon
5. Set environment variables
6. Done!
