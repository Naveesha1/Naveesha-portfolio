// One-time migration of the old hardcoded content (from src/components/*)
// into the database, so the site has real content on first run instead of
// coming up empty. Safe to re-run: it skips if data already exists.
const fs = require('fs');
const path = require('path');
const db = require('../db');
const { saveResizedImage } = require('../lib/imageUpload');

const ASSETS = path.join(__dirname, '..', '..', 'src', 'Assets');

async function importImage(filename, maxWidth) {
  const filePath = path.join(ASSETS, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping missing asset: ${filename}`);
    return null;
  }
  const buffer = fs.readFileSync(filePath);
  return saveResizedImage(buffer, { maxWidth });
}

const PROJECTS = [
  {
    title: 'Customer Relationship Management System',
    description:
      'A state-of-the-art CRM platform designed to enhance customer interactions and streamline business processes. Implemented modules for customer contact management, sales and lead tracking, communication automation, and customer support.',
    image: 'workCrm.png',
    link: 'https://github.com/heelibathdeniyahanb/SolexCodeCRMNew',
    tags: ['web'],
  },
  {
    title: 'Website for Clothing Atelier',
    description:
      'A modern and user-friendly online dress shop with an intuitive dress selection interface, add-to-cart functionality, secure payment processing, and real-time order tracking.',
    image: 'dress.png',
    link: 'https://github.com/Naveesha1/Dress-store',
    tags: ['web'],
  },
  {
    title: 'Website for Coffee Shop',
    description:
      'A modern, user-friendly website for a local coffee shop, featuring an intuitive layout, responsive design, and integrated online menu.',
    image: 'works-coffe.jpg',
    link: 'https://github.com/Naveesha1/coffeeshop.github.io',
    tags: ['web'],
  },
  {
    title: 'Logo Design Creativity & Application',
    description:
      'A unique and elegant logo for a jewelry shop, reflecting its brand identity and appeal.',
    image: 'works-logo.png',
    link: 'https://drive.google.com/file/d/1IvJahZQ33ZOT_wj2MzZ4qr8hQpkb87nu/view?usp=sharing',
    tags: ['graphic'],
  },
  {
    title: 'IoT - Real Time Gas Station Fuel Tank',
    description:
      'A real-time monitoring solution for gas station fuel tanks using an ESP32 Devkit V1 board and various sensors, tracking fuel volume, temperature, and pressure, with data synced to Firebase.',
    image: 'works-hardware.jpg',
    link: '',
    tags: ['hardware'],
  },
  {
    title: 'Ice Cube Dropping Video',
    description:
      'A dynamic short video in Blender, showcasing ice cubes dropping into a glass of water with realistic water splash effects.',
    image: 'works-iceCubeVedio.PNG',
    link: 'https://drive.google.com/file/d/17iY23y2krM0UV9dbvqJmoXf7VHA32X_T/view?usp=sharing',
    tags: ['graphic'],
  },
  {
    title: 'Rendered Video',
    description:
      'A detailed 3D render of a burial ground using Blender, showcasing intricate textures and atmospheric effects.',
    image: 'works-vedio.PNG',
    link: 'https://drive.google.com/file/d/188llgm3HgE_A0fvChCoiHVbkY8WExePL/view?usp=sharing',
    tags: ['graphic'],
  },
];

async function seedProfile() {
  const row = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  if (row && (row.name || row.bio || row.home_photo_path || row.about_photo_path)) {
    console.log('Profile already has content, skipping.');
    return;
  }
  const homePhotoPath = await importImage('my2.jpeg', 800);
  const aboutPhotoPath = await importImage('my3.jpeg', 800);
  db.prepare(
    `UPDATE profile SET name = ?, bio = ?, home_photo_path = ?, about_photo_path = ?, updated_at = datetime('now') WHERE id = 1`
  ).run(
    'Naveesha Kavindi',
    "I am a passionate and driven software engineer eager to join a forward-thinking organization where I can leverage my technical skills and enthusiasm for continuous learning. My goal is to contribute to innovative software projects that drive technological advancement and business success while achieving personal and professional growth.",
    homePhotoPath,
    aboutPhotoPath
  );
  console.log('Seeded profile.');
}

async function seedProjects() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM projects').get().n;
  if (count > 0) {
    console.log('Projects already exist, skipping.');
    return;
  }
  const insert = db.prepare(
    `INSERT INTO projects (title, description, image_path, link, tags, sort_order) VALUES (?, ?, ?, ?, ?, ?)`
  );
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i];
    const imagePath = await importImage(p.image, 1200);
    insert.run(p.title, p.description, imagePath, p.link, JSON.stringify(p.tags), i);
    console.log(`Seeded project: ${p.title}`);
  }
}

(async () => {
  await seedProfile();
  await seedProjects();
  console.log('Done.');
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
