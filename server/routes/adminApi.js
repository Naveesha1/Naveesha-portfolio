const express = require('express');
const db = require('../db');
const requireAdmin = require('../middleware/requireAdmin');
const { upload, saveResizedImage, deleteImage } = require('../lib/imageUpload');

const router = express.Router();
router.use(requireAdmin);

// ---- Profile ----

router.get('/profile', (req, res) => {
  const profile = db.prepare('SELECT name, bio, home_photo_path, about_photo_path FROM profile WHERE id = 1').get();
  res.json({
    name: profile?.name || '',
    bio: profile?.bio || '',
    homePhoto: profile?.home_photo_path || null,
    aboutPhoto: profile?.about_photo_path || null,
  });
});

router.put(
  '/profile',
  upload.fields([
    { name: 'homePhoto', maxCount: 1 },
    { name: 'aboutPhoto', maxCount: 1 },
  ]),
  async (req, res) => {
    const { name = '', bio = '' } = req.body || {};
    const current = db.prepare('SELECT home_photo_path, about_photo_path FROM profile WHERE id = 1').get();
    let homePhotoPath = current?.home_photo_path || null;
    let aboutPhotoPath = current?.about_photo_path || null;

    const homeFile = req.files?.homePhoto?.[0];
    const aboutFile = req.files?.aboutPhoto?.[0];

    if (homeFile) {
      homePhotoPath = await saveResizedImage(homeFile.buffer, { maxWidth: 800 });
      if (current?.home_photo_path) deleteImage(current.home_photo_path);
    }
    if (aboutFile) {
      aboutPhotoPath = await saveResizedImage(aboutFile.buffer, { maxWidth: 800 });
      if (current?.about_photo_path) deleteImage(current.about_photo_path);
    }

    db.prepare(
      `UPDATE profile SET name = ?, bio = ?, home_photo_path = ?, about_photo_path = ?, updated_at = datetime('now') WHERE id = 1`
    ).run(name, bio, homePhotoPath, aboutPhotoPath);

    res.json({ name, bio, homePhoto: homePhotoPath, aboutPhoto: aboutPhotoPath });
  }
);

// ---- Projects ----

router.get('/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC, id ASC').all();
  res.json(rows.map(serializeProject));
});

router.post('/projects', upload.single('image'), async (req, res) => {
  const { title, description = '', link = '', tags = '[]' } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });

  let imagePath = null;
  if (req.file) imagePath = await saveResizedImage(req.file.buffer, { maxWidth: 1200 });

  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order), -1) AS m FROM projects').get().m;

  const info = db
    .prepare(
      `INSERT INTO projects (title, description, image_path, link, tags, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(title.trim(), description, imagePath, link, normalizeTags(tags), maxOrder + 1);

  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(serializeProject(row));
});

router.put('/projects/:id', upload.single('image'), async (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  const {
    title = existing.title,
    description = existing.description,
    link = existing.link,
    tags = existing.tags,
  } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' });

  let imagePath = existing.image_path;
  if (req.file) {
    imagePath = await saveResizedImage(req.file.buffer, { maxWidth: 1200 });
    if (existing.image_path) deleteImage(existing.image_path);
  }

  db.prepare(
    `UPDATE projects SET title = ?, description = ?, image_path = ?, link = ?, tags = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(title.trim(), description, imagePath, link, normalizeTags(tags), req.params.id);

  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json(serializeProject(row));
});

router.delete('/projects/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  if (existing.image_path) deleteImage(existing.image_path);

  res.json({ ok: true });
});

router.put('/projects/:id/reorder', (req, res) => {
  const { direction } = req.body || {};
  const rows = db.prepare('SELECT id, sort_order FROM projects ORDER BY sort_order ASC, id ASC').all();
  const idx = rows.findIndex((r) => r.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Project not found' });

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return res.json({ ok: true });

  const a = rows[idx];
  const b = rows[swapIdx];
  const update = db.prepare('UPDATE projects SET sort_order = ? WHERE id = ?');
  update.run(b.sort_order, a.id);
  update.run(a.sort_order, b.id);

  res.json({ ok: true });
});

function normalizeTags(tags) {
  if (Array.isArray(tags)) return JSON.stringify(tags.map(String));
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return JSON.stringify(parsed.map(String));
    } catch {
      // fall through to comma-split
    }
    return JSON.stringify(
      tags.split(',').map((t) => t.trim()).filter(Boolean)
    );
  }
  return '[]';
}

function serializeProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image_path,
    link: row.link,
    tags: JSON.parse(row.tags || '[]'),
    sortOrder: row.sort_order,
  };
}

module.exports = router;
