const isProduction = process.env.NODE_ENV === 'production';
const canonicalHost = 'story.msrx.co.in';
const canonicalHostPattern = 'story\\.msrx\\.co\\.in(?::\\d+)?';
const wwwHostPattern = 'www\\.story\\.msrx\\.co\\.in(?::\\d+)?';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: isProduction ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), geolocation=(), microphone=()' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: wwwHostPattern }],
        destination: `https://${canonicalHost}/:path*`,
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/story-assets/:path*',
          has: [{ type: 'host', value: canonicalHostPattern }],
          destination: '/_next/static/:path*',
        },
      ],
      afterFiles: [
        {
          source: '/',
          has: [{ type: 'host', value: canonicalHostPattern }],
          destination: '/index',
        },
      ],
      fallback: [],
    };
  },
};

module.exports = nextConfig;
