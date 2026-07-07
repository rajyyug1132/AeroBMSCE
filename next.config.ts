import type { NextConfig } from 'next';

/**
 * Security headers. CSP allows Supabase (auth + storage) over https/wss and
 * inline styles/scripts that Next.js needs for hydration. Tighten with a nonce
 * when a custom server is available.
 */
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const config: NextConfig = {
  reactStrictMode: true,
  // Soft cross-fade between routes (App Router wraps navigations in
  // document.startViewTransition). Native @view-transition CSS handles the rest.
  experimental: { viewTransition: true },
  // Pin the workspace root — a stray parent lockfile otherwise confuses Turbopack.
  turbopack: { root: import.meta.dirname },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async redirects() {
    // /sponsor was renamed to /partner — keep old links and SEO intact.
    return [{ source: '/sponsor', destination: '/partner', permanent: true }];
  },
};

export default config;
