const path = require("path");

const nextConfig = {
  // distDir: "build",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    additionalData: `
        $color-primary: #4b4b4b;
        $color-primary-black: #222;
        $color-secondary: #c0fff4;
        $color-quad: #ffc0cb;
        $color--bg-white: #fff;
        $color-gray: rgba(0, 0, 0, 0.1);
        $color-light-gray: #dbdbdb;
    `,
  },
  compiler: {
    styledComponents: true,
  },
  cacheComponents: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
  env: {},
};

module.exports = nextConfig;
