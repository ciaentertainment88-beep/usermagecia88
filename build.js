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

// Baca semua folder di LOGO
function readFolders(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
}

// Baca semua gambar per folder
function readImagesPerFolder(dir, folders) {
    const images = {};
    folders.forEach(folder => {
        const folderPath = path.join(dir, folder);
        const files = fs.readdirSync(folderPath)
            .filter(f => /\.(png|gif|jpg|jpeg|webp)$/i.test(f));
        images[folder] = files.map(f => path.join('LOGO', folder, f));
    });
    return images;
}

// Generate HTML interaktif
function generateHTML(images) {
    const folders = Object.keys(images);
    let html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CIA88 ASSET BY DIGMA88</title>
<style>
body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
h1 { margin-bottom: 20px; text-align: center; }
#buttons { text-align: center; margin-bottom: 20px; }
button { margin: 5px; padding: 8px 16px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc; background: #eee; transition: 0.3s; }
button:hover { background: #0050e9; color: #fff; }
button.active { background: #0050e9; color: #fff; }
.gallery { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
.gallery img { max-width: 150px; width: 100%; height: auto; border: 1px solid #ccc; border-radius: 8px; display: none; transition: transform 0.3s, box-shadow 0.3s; }
.gallery img:hover { transform: scale(1.1); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
@media (max-width: 600px) {
    .gallery img { max-width: 100px; }
}
</style>
</head>
<body>
<h1>Logo Gallery</h1>
<div id="buttons">
<button class="active" onclick="filterFolder('all')">Semua</button>
`;

    // tombol folder
    folders.forEach(folder => {
        html += `<button onclick="filterFolder('${folder}')">${folder}</button>\n`;
    });

    html += `</div>
<div class="gallery">\n`;

    // semua gambar
    for (const [folder, files] of Object.entries(images)) {
        files.forEach(f => {
            html += `<img src="${f}" alt="${path.basename(f)}" data-folder="${folder}">\n`;
        });
    }

    html += `</div>
<script>
function filterFolder(folder) {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        img.style.display = (folder === 'all' || img.dataset.folder === folder) ? 'block' : 'none';
    });
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}
// tampilkan semua awalnya
filterFolder('all');
</script>
</body>
</html>`;
    return html;
}

// Main
const folders = readFolders(path.join(outputDir, 'LOGO'));
const images = readImagesPerFolder(path.join(outputDir, 'LOGO'), folders);
const htmlContent = generateHTML(images);
fs.writeFileSync(outputFile, htmlContent, 'utf8');

console.log(`✅ HTML interaktif dengan hover & responsive berhasil dibuat di ${outputFile}`);
