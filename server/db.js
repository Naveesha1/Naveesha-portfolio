const path = require('path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, 'data.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    home_photo_path TEXT,
    about_photo_path TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    image_path TEXT,
    link TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Migrate the old single photo_path column (pre-dating separate home/about
// photos) into home_photo_path/about_photo_path so nobody's existing photo
// gets lost when upgrading.
const profileColumns = db.prepare('PRAGMA table_info(profile)').all().map((c) => c.name);
if (profileColumns.includes('photo_path')) {
  db.exec('ALTER TABLE profile ADD COLUMN home_photo_path TEXT');
  db.exec('ALTER TABLE profile ADD COLUMN about_photo_path TEXT');
  db.exec('UPDATE profile SET home_photo_path = photo_path, about_photo_path = photo_path');
  db.exec('ALTER TABLE profile DROP COLUMN photo_path');
}

// Ensure the single profile row always exists.
db.prepare(
  `INSERT OR IGNORE INTO profile (id, name, bio) VALUES (1, '', '')`
).run();

module.exports = db;
