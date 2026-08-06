const { createProxyMiddleware } = require('http-proxy-middleware');

// CRA's built-in `"proxy"` field in package.json refuses to forward requests
// whose Accept header includes text/html (i.e. real browser navigation), so
// http://localhost:3000/admin would just get served the React app instead of
// hitting Express. This proxies those paths unconditionally instead.
module.exports = function (app) {
  app.use(
    ['/api', '/admin', '/uploads'],
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
