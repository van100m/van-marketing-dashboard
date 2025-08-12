# 🚀 Marketing Dashboard Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended - 5 minutes)

**Why Vercel?** Perfect for Next.js with automatic deployments, edge functions, and great developer experience.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (first time)
vercel

# Deploy to production
vercel --prod
```

**Environment Variables to Set in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 2. Netlify (Alternative)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

### 3. Self-Hosted with Docker

```bash
# Build Docker image
docker build -t marketing-dashboard .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your_url marketing-dashboard
```

---

## 🔄 Continuous Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# Run type checking
npm run type-check

# Build for production
npm run build
```

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-analytics

# Make changes, commit
git add .
git commit -m "Add advanced analytics dashboard"

# Push and create PR
git push origin feature/new-analytics
```

### Automatic Deployments

**GitHub Integration:**
1. Connect your repository to Vercel/Netlify
2. Every push to `main` triggers automatic deployment
3. Preview deployments for pull requests

---

## 📊 Post-Deployment Setup

### 1. Environment Configuration

**Production Environment Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
NODE_ENV=production
```

### 2. Domain Setup

**Custom Domain (Vercel):**
```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS
# Add CNAME record: yourdomain.com -> your-project.vercel.app
```

### 3. SSL Certificate

All recommended platforms (Vercel, Netlify) provide automatic SSL certificates.

---

## 🔧 Development Best Practices

### Branch Strategy
```
main          # Production-ready code
develop       # Integration branch
feature/*     # New features
hotfix/*      # Critical fixes
```

### Code Quality
```bash
# Pre-commit hooks
npm run type-check
npm run lint
npm run test

# Automated with husky
npm install husky --save-dev
npx husky add .husky/pre-commit "npm run type-check"
```

### Environment Management
```bash
# Local development
.env.local

# Staging
.env.staging

# Production
.env.production
```

---

## 📈 Monitoring & Analytics

### Add Performance Monitoring
```typescript
// Add to pages/_app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### Error Tracking
```bash
# Add Sentry for error tracking
npm install @sentry/nextjs

# Configure in sentry.client.config.js
```

---

## 🎯 Deployment Checklist

- [ ] Environment variables configured
- [ ] Build passes locally
- [ ] Type checking passes
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error monitoring setup
- [ ] Performance monitoring enabled

---

## 🔄 Making Changes After Deployment

### Quick Changes
1. Make changes locally
2. Test with `npm run dev`
3. Commit and push to `main`
4. Automatic deployment triggers

### Major Updates
1. Create feature branch
2. Develop and test locally
3. Create pull request
4. Preview deployment created automatically
5. Merge to `main` → Production deployment

Your marketing dashboard is now ready for the world! 🎉