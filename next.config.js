const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  swcMinify: false, // Disable because this fails to build on raspberry pi
});
