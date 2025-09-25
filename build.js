const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const logoDir = path.join(__dirname, 'LOGO');
const outputDir = path.join(__dirname, 'dist');
const outputFile = path.join(outputDir, 'index.html');

fse.ensureDirSync(outputDir);
fse.copySync(logoDir, path.join(outputDir, 'LOGO'));

function readFolders(dir) {
    return fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
}

function readFilesPerFolder(dir, folders) {
    const filesPerFolder = {};
    folders.forEach(folder => {
        const folderPath = path.join(dir, folder);
        const files = fs.readdirSync(folderPath)
            .filter(f => fs.statSync(path.join(folderPath, f)).isFile());
        filesPerFolder[folder] = files.map(f => path.join('LOGO', folder, f));
    });
    return filesPerFolder;
}

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

.folder-section { margin-bottom: 30px; }
.folder-title { margin-bottom: 10px; font-size: 1.2em; font-weight: bold; }
.folder-gallery { display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; }
.folder-gallery img {
    height: auto;
    width: auto;
    max-height: 150px;
    max-width: 150px;
    min-height: 30px;
    min-width: 30px;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}
.folder-gallery img:hover { transform: scale(1.05); box-shadow: 0 4px 15px rgba(0,0,0,0.3); }

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

folders.forEach(folder => {
    html += `<button onclick="filterFolder('${folder}')">${folder}</button>\n`;
});

html += `</div>
<div id="gallery-container">\n`;

folders.forEach(folder => {
    html += `<div class="folder-section" data-folder="${folder}">
        <div class="folder-title">${folder}</div>
        <div class="folder-gallery">\n`;

    filesPerFolder[folder].forEach(f => {
        html += `<img src="${f}" alt="${path.basename(f)}" data-folder="${folder}" onclick="openLightbox('${f}')">\n`;
    });

    html += `</div>
    </div>\n`;
});

html += `</div>

<div id="lightboxOverlay" onclick="closeLightbox()">
  <span>&times;</span>
  <img id="lightboxImage" src="" alt="Gambar">
</div>

<script>
function filterFolder(folder) {
    const sections = document.querySelectorAll('.folder-section');
    sections.forEach(sec => {
        if(folder === 'all') {
            sec.style.display = 'block';
            sec.querySelectorAll('img').forEach(img => img.style.display = 'inline-block');
        } else {
            if(sec.dataset.folder === folder) {
                sec.style.display = 'block';
                sec.querySelectorAll('img').forEach(img => img.style.display = 'inline-block');
            } else {
                sec.style.display = 'none';
            }
        }
    });
    document.querySelectorAll('#buttons button').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Tampilkan semua awalnya
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
</html>
`;
    return html;
}

// Main
const folders = readFolders(path.join(outputDir, 'LOGO'));
const filesPerFolder = readFilesPerFolder(path.join(outputDir, 'LOGO'), folders);
const htmlContent = generateHTML(filesPerFolder);
fs.writeFileSync(outputFile, htmlContent, 'utf8');

console.log('✅ Gallery per folder horizontal dengan filter berhasil dibuat di', outputFile);
