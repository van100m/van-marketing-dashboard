#!/bin/bash

# Marketing Dashboard Deployment Script

set -e

echo "🚀 Starting Marketing Dashboard deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_SUPABASE_URL not set"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type check
echo "🔍 Running type check..."
npm run type-check

# Run build
echo "🏗️  Building application..."
npm run build

# Success message
echo "✅ Build completed successfully!"
echo ""
echo "📊 Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Deploy to Netlify: netlify deploy --prod --dir=.next"
echo "3. Deploy to AWS: Use AWS Amplify or S3 + CloudFront"
echo ""
echo "🌐 Your marketing dashboard is ready for production!"