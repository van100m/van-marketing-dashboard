/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CMO_AGENT_URL: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/cmoAgent',
    NEXT_PUBLIC_AGENT_BASE_URL: process.env.NEXT_PUBLIC_AGENT_BASE_URL || 'https://us-central1-van-marketing-intelligence.cloudfunctions.net',
  },
  images: {
    domains: [
      'localhost',
      'your-domain.com',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/agents/:path*',
        destination: 'https://us-central1-van-marketing-intelligence.cloudfunctions.net/:path*',
      },
    ];
  },
};

module.exports = nextConfig;