const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcSvg = path.resolve(__dirname, '../web/icons/icon-512.svg');
const outDirs = [
  path.resolve(__dirname, '../web/icons'),
  path.resolve(__dirname, '../assets/icons')
];
// Include common Android, web and iOS sizes (in px)
const sizes = [20, 29, 40, 48, 60, 72, 76, 83, 96, 120, 144, 152, 167, 180, 192, 256, 384, 512, 1024];

async function generate() {
  if (!fs.existsSync(srcSvg)) {
    console.error('Source SVG not found:', srcSvg);
    process.exit(1);
  }

  for (const outDir of outDirs) {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    for (const size of sizes) {
      const outPath = path.join(outDir, `icon-${size}.png`);
      await sharp(srcSvg).resize(size, size).png().toFile(outPath);
      console.log('Wrote', outPath);
    }
  }
  console.log('Icon generation complete.');
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});