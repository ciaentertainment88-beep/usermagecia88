const fs = require('fs');
const path = require('path');

const logoFolder = path.join(__dirname, 'LOGO');
const outputDir = path.join(__dirname, 'dist');
const outputFile = path.join(outputDir, 'index.html');

fs.mkdirSync(outputDir, { recursive: true });

let html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Gallery Otomatis Build-Time</title>
<style>
body { font-family: Arial, sans-serif; background-color: #f0f0f0; padding: 30px; text-align: center; }
h1 { color: #333; margin-bottom: 40px; }
.columns { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; }
.column { background-color: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 200px; }
.column h2 { margin-bottom: 20px; color: #555; }
.column img { max-width: 100%; height: auto; margin-bottom: 10px; border-radius: 6px; }
.caption { font-size: 13px; color: #666; margin-bottom: 15px; }
</style>
</head>
<body>
<h1>Gallery Otomatis Build-Time</h1>
<div class="columns">
`;

const folders = fs.readdirSync(logoFolder).filter(f => fs.statSync(path.join(logoFolder, f)).isDirectory());

folders.forEach(folder => {
    html += `<div class="column"><h2>${folder}</h2>\n`;

    const files = fs.readdirSync(path.join(logoFolder, folder))
        .filter(f => /\.(png|gif)$/i.test(f));

    files.forEach(file => {
        const filePath = `LOGO/${folder}/${file}`;
        const fileName = path.basename(file);
        html += `<img src="${filePath}" alt="${fileName}"><div class="caption">${fileName}</div>\n`;
    });

    html += `</div>\n`;
});

html += `</div>\n</body>\n</html>`;

fs.writeFileSync(outputFile, html);
console.log("✅ Build selesai! HTML disimpan di dist/index.html");
