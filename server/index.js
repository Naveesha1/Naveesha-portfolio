require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');

require('./db'); // ensures tables exist before anything else runs

const publicApi = require('./routes/publicApi');
const auth = require('./routes/auth');
const adminApi = require('./routes/adminApi');
const requireAdmin = require('./middleware/requireAdmin');

const app = express();
const PORT = process.env.PORT || 5000;
const BUILD_DIR = path.join(__dirname, '..', 'build');

if (!process.env.SESSION_SECRET) {
  console.warn('WARNING: SESSION_SECRET is not set in .env — using an insecure default.');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-only-insecure-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false',
      maxAge: 1000 * 60 * 60 * 8, // 8 hours
    },
  })
);

app.use('/uploads', express.static(process.env.UPLOADS_DIR || path.join(__dirname, 'uploads')));

// Public content API consumed by the React site.
app.use('/api', publicApi);

// Admin auth + protected CRUD API.
app.use('/admin/auth', auth);
app.use('/admin/api', adminApi);

// Admin panel (plain HTML/JS). Assets are public; the dashboard page itself
// is gated so a logged-out visitor is bounced to the login page.
const adminPanelDir = path.join(__dirname, 'admin-panel');
app.get('/admin', (req, res) => {
  if (!(req.session && req.session.isAdmin)) return res.redirect('/admin/login.html');
  res.sendFile(path.join(adminPanelDir, 'dashboard.html'));
});
app.use('/admin', express.static(adminPanelDir));

// The built React app (run `npm run build` in the project root first).
app.use(express.static(BUILD_DIR));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/admin')) return next();
  res.sendFile(path.join(BUILD_DIR, 'index.html'), (err) => {
    if (err) next();
  });
});

// Multer / general error handler.
app.use((err, req, res, next) => {
  if (err && err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Image is too large (max 8MB)' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
