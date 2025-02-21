const fs = require('fs');
const path = require('path');

// Source path
const workerPath = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');

// Destination path
const destPath = path.join(__dirname, 'public', 'pdf.worker.js');

// Create public directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'));
}

// Copy the file
fs.copyFileSync(workerPath, destPath);

console.log('PDF.js worker file copied successfully!'); 