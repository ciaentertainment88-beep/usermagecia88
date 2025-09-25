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

// Baca semua file per folder tanpa filter ekstensi
function readFilesPerFolder(dir, folders) {
    const filesPerFolder = {};
    folders.forEach(folder => {
        const folderPath = path.join(dir, folder);
        const files = fs.readdirSync(folderPath)
            .filter(f => fs.statSync(path.join(folderPath, f)).isFile()); // hanya file
        filesPerFolder[folder] = files.map(f => path.join('LOGO', folder, f));
    });
    return filesPerFolder;
}

// Generate HTML interaktif + lightbox
function generateHTML(filesPerFolder) {
    const folders = Object.keys(filesPerFolder);
    let html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Logo Gallery</title>
<style>
body { font-family: sans-serif; padding: 20px; background: #f9f9f9; }
h1 { margin-bottom: 20px; text-align: center; }
#buttons { text-align: center; margin-bottom: 20px; }
button { margin: 5px; padding: 8px 16px; cursor: pointer; border-radius: 5px; border: 1px solid #ccc; background: #eee; transition: 0.3s; }
button:hover { background: #0050e9; color: #fff; }
button.active { background: #0050e9; color: #fff; }
.gallery { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
.gallery img { max-width: 150px; height: auto; border: 1px solid #ccc; border-radius: 8px; display: none; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; }
.gallery img:hover { transform: scale(1.1); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }

/* Lightbox */
#lightboxOverlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center;
    z-index: 1000;
}
#lightboxOverlay img { max-width: 90%; max-height: 90%; border-radius: 10px; }
#lightboxOverlay span { position: absolute; top: 20px; right: 30px; font-size: 30px; color: #fff; cursor: pointer; }
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

    // semua file
    for (const [folder, files] of Object.entries(filesPerFolder)) {
        files.forEach(f => {
            html += `<img src="${f}" alt="${path.basename(f)}" data-folder="${folder}" onclick="openLightbox('${f}')">\n`;
        });
    }

    html += `</div>

<!-- Lightbox overlay -->
<div id="lightboxOverlay" onclick="closeLightbox()">
  <span>&times;</span>
  <img id="lightboxImage" src="" alt="Gambar">
</div>

<script>
function filterFolder(folder) {
    const imgs = document.querySelectorAll('.gallery img');
    imgs.forEach(img => {
        img.style.display = (folder === 'all' || img.dataset.folder === folder) ? 'inline-block' : 'none';
    });
    document.querySelectorAll('#buttons button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}
filterFolder('all');

function openLightbox(src) {
    const overlay = document.getElementById('lightboxOverlay');
    const img = document.getElementById('lightboxImage');
    img.src = src;
    overlay.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightboxOverlay').style.display = 'none';
}
</script>
</body>
</html>`;
    return html;
}

// Main
const folders = readFolders(path.join(outputDir, 'LOGO'));
const filesPerFolder = readFilesPerFolder(path.join(outputDir, 'LOGO'), folders);
const htmlContent = generateHTML(filesPerFolder);
fs.writeFileSync(outputFile, htmlContent, 'utf8');

console.log(`✅ HTML gallery fleksibel berhasil dibuat di ${outputFile}`);
