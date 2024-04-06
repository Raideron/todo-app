const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  experimental: {
    appDir: true,
  }
});
