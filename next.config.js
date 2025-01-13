const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,
  }
});
