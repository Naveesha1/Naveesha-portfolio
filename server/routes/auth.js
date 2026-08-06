const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body || {};
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    return res.status(500).json({ error: 'Server is missing ADMIN_PASSWORD_HASH' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required' });
  }

  const ok = await bcrypt.compare(password, hash);
  if (!ok) return res.status(401).json({ error: 'Incorrect password' });

  req.session.isAdmin = true;
  res.json({ ok: true });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/session', (req, res) => {
  res.json({ isAdmin: !!(req.session && req.session.isAdmin) });
});

module.exports = router;
