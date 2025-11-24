const fs = require('fs');
const path = require('path');

// الملفات والمجلدات اللي مش عايزينها (مهم جداً عشان الملف ميكبرش)
const IGNORE_DIRS = ['node_modules', '.git', '.idea', '.vscode', '__pycache__', 'venv'];
const IGNORE_FILES = ['package-lock.json', 'yarn.lock', '.DS_Store', 'collect_code.js', 'model.pkl']; // تجاهل الموديل لأنه binary
const ALLOWED_EXTS = ['.js', '.json', '.py', '.env']; // الامتدادات اللي تهمنا

const outputFile = 'project_dump.txt';

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            if (!IGNORE_FILES.includes(file) && ALLOWED_EXTS.includes(path.extname(file))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles(__dirname);
let outputContent = `Project Structure & Code Dump\nGenerated on: ${new Date().toISOString()}\n\n`;

allFiles.forEach(file => {
    const relativePath = path.relative(__dirname, file);
    if (relativePath === outputFile) return;

    const content = fs.readFileSync(file, 'utf8');
    outputContent += `\n================================================================================\n`;
    outputContent += `FILE PATH: ${relativePath}\n`;
    outputContent += `================================================================================\n`;
    outputContent += content + '\n\n';
});

fs.writeFileSync(outputFile, outputContent);
console.log(`✅ Done! All code saved to '${outputFile}'. Upload this file to the chat.`);