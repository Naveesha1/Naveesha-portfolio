const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/profile', (req, res) => {
  const profile = db.prepare('SELECT name, bio, home_photo_path, about_photo_path FROM profile WHERE id = 1').get();
  res.json({
    name: profile?.name || '',
    bio: profile?.bio || '',
    homePhoto: profile?.home_photo_path || null,
    aboutPhoto: profile?.about_photo_path || null,
  });
});

router.get('/projects', (req, res) => {
  const rows = db
    .prepare('SELECT id, title, description, image_path, link, tags FROM projects ORDER BY sort_order ASC, id ASC')
    .all();
  res.json(
    rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      image: row.image_path,
      link: row.link,
      tags: JSON.parse(row.tags || '[]'),
    }))
  );
});

module.exports = router;
