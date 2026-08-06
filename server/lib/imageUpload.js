const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const sharp = require('sharp');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Keep the upload in memory; we re-encode with sharp before writing to disk,
// so nothing untrusted ever hits the filesystem as-is.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

async function saveResizedImage(buffer, { maxWidth }) {
  const filename = `${crypto.randomUUID()}.webp`;
  const outPath = path.join(UPLOAD_DIR, filename);
  await sharp(buffer)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outPath);
  return `/uploads/${filename}`;
}

function deleteImage(publicPath) {
  if (!publicPath) return;
  const filename = path.basename(publicPath);
  const filePath = path.join(UPLOAD_DIR, filename);
  fs.unlink(filePath, () => {});
}

module.exports = { upload, saveResizedImage, deleteImage, UPLOAD_DIR };
