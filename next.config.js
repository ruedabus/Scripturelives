/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  // Prevent clickjacking — disallow iframing from other sites
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop browsers from sniffing MIME types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control how much referrer info is sent to third parties
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Limit browser features available to the page
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // Force HTTPS for 1 year — production only (avoids breaking local HTTP dev)
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
  // Content Security Policy
  // 'unsafe-inline' kept for Next.js inline styles; 'unsafe-eval' removed.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Google Analytics/Tag Manager (no unsafe-eval)
      "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com",
      // Styles: self + inline (Next.js uses inline styles)
      "style-src 'self' 'unsafe-inline'",
      // Images: self + Wikipedia/Wikimedia + YouTube thumbs + data/blob URIs
      "img-src 'self' data: blob: https://*.wikimedia.org https://*.wikipedia.org https://i.ytimg.com https://yt3.ggpht.com https://www.youtube.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://tile.openstreetmap.org",
      // Fonts: self only
      "font-src 'self'",
      // Frames: YouTube embeds only
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      // Fetch / XHR / API calls
      "connect-src 'self' https://rest.api.bible https://api.openai.com https://en.wikipedia.org https://en.m.wikipedia.org https://www.googleapis.com",
      // Media
      "media-src 'self'",
      // Object/plugin embeds — none
      "object-src 'none'",
      // Base URI restriction
      "base-uri 'self'",
      // Form submissions
      "form-action 'self' https://www.paypal.com",
    ].join("; "),
  },
];

const nextConfig = {
  // allowedDevOrigins accepts a list of local dev hosts.
  // Set COWORK_DEV_ORIGIN=192.168.x.x in .env.local for LAN preview.
  ...(process.env.COWORK_DEV_ORIGIN
    ? { allowedDevOrigins: [process.env.COWORK_DEV_ORIGIN] }
    : {}),

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
