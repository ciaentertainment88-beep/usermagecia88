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
/* --- Reset dan body --- */
body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f0f4ff, #d9e4ff);
    color: #333;
}

/* --- Header --- */
h1 {
    text-align: center;
    margin: 30px 0 10px;
    font-size: 2em;
    background: linear-gradient(90deg, #4e54c8, #8f94fb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* --- Filter buttons --- */
#buttons {
    text-align: center;
    margin-bottom: 30px;
}
button {
    margin: 5px;
    padding: 10px 20px;
    border-radius: 25px;
    border: none;
    background: #8f94fb;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
}
button:hover {
    background: #4e54c8;
}
button.active {
    background: #ff758c;
    color: white;
}

/* --- Folder section --- */
.folder-section {
    margin-bottom: 40px;
    padding: 15px;
    background: white;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* --- Folder title --- */
.folder-title {
    margin-bottom: 15px;
    font-size: 1.3em;
    font-weight: bold;
    color: #4e54c8;
}

/* --- Gallery images --- */
.folder-gallery {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    padding-bottom: 10px;
}
.folder-gallery img {
    height: auto;
    width: auto;
    max-height: 150px;
    max-width: 150px;
    min-height: 30px;
    min-width: 30px;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}
.folder-gallery img:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

/* --- Lightbox --- */
#lightboxOverlay {
    position: fixed;
    top:0; left:0;
    width:100%; height:100%;
    background: rgba(0,0,0,0.85);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
#lightboxOverlay img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
#lightboxOverlay span {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 40px;
    color: white;
    cursor: pointer;
}
</style>
</head>
<body>
<h1>Logo Gallery CIA88 by DIGMA</h1>
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

console.log('✅ Gallery dengan tampilan elegan berhasil dibuat di', outputFile);
