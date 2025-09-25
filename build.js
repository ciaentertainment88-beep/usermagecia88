// build.js
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const logoDir = path.join(__dirname, 'LOGO');
const outputDir = path.join(__dirname, 'dist');
const outputFile = path.join(outputDir, 'index.html');

// Pastikan folder dist ada
fse.ensureDirSync(outputDir);

// Copy semua folder LOGO ke dist/LOGO
fse.copySync(logoDir, path.join(outputDir, 'LOGO'));

// Fungsi untuk membaca semua file gambar di folder beserta subfolder
function readImages(dir) {
    const categories = fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

    const images = {};

    categories.forEach(cat => {
        const catPath = path.join(dir, cat);
        const files = fs.readdirSync(catPath)
            .filter(f => /\.(png|gif|jpg|jpeg|webp)$/i.test(f));
        images[cat] = files.map(f => path.join('LOGO', cat, f));
    });

    return images;
}

// Generate HTML interaktif
function generateHTML(images) {
    const categories = Object.keys(images);
    let html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Logo Gallery</title>
<style>
body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
h1 { margin-bottom: 20px; }
button { margin: 5px; padding: 8px 16px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc; background: #eee; }
button.active { background: #0050e9; color: #fff; }
.gallery { display: flex; flex-wrap: wrap; margin-top: 20px; }
img { max-width: 150px; margin: 10px; border: 1px solid #ccc; border-radius: 8px; display: none; }
</style>
</head>
<body>
<h1>Logo Gallery</h1>
<div id="buttons">
<button class="active" onclick="filterCategory('all')">Semua</button>
`;

    // tombol kategori
    categories.forEach(cat => {
        html += `<button onclick="filterCategory('${cat}')">${cat}</button>\n`;
    });

    html += `</div>
<div class="gallery">\n`;

    // semua gambar
    for (const [category, files] of Object.entries(images)) {
        files.forEach(f => {
            html += `<img src="${f}" alt="${path.basename(f)}" data-category="${category}">\n`;
        });
    }

    html += `</div>
<script>
function filterCategory(cat) {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        img.style.display = (cat === 'all' || img.dataset.category === cat) ? 'block' : 'none';
    });
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}
// Tampilkan semua gambar awal
filterCategory('all');
</script>
</body>
</html>`;
    return html;
}

// Main
const images = readImages(path.join(outputDir, 'LOGO'));
const htmlContent = generateHTML(images);
fs.writeFileSync(outputFile, htmlContent, 'utf8');

console.log(`✅ Interaktif HTML berhasil dibuat di ${outputFile}`);
