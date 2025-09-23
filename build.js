const fs = require('fs');
const path = require('path');

const logoFolder = path.join(__dirname, 'LOGO');
const outputFile = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
}

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

const folders = fs.readdirSync(logoFolder);
folders.forEach(folder => {
    const folderPath = path.join(logoFolder, folder);
    if (fs.statSync(folderPath).isDirectory()) {
        html += `<div class="column">\n<h2>${folder}</h2>\n`;
        const files = fs.readdirSync(folderPath);
        files.forEach(file => {
            const ext = path.extname(file);
            const name = path.basename(file, ext);
            html += `<img src="LOGO/${folder}/${file}" alt="${name}"><div class="caption">${file}</div>\n`;
        });
        html += `</div>\n`;
    }
});

html += `</div>\n</body>\n</html>`;

fs.writeFileSync(outputFile, html);
console.log("Build selesai! HTML disimpan di dist/index.html");
