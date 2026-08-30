const fs = require('fs');
const path = require('path');

const libraryDir = path.join(__dirname, '..', 'library');
const manifestPath = path.join(libraryDir, 'manifest.json');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

const files = fs
	.readdirSync(libraryDir)
	.filter((f) => imageExtensions.has(path.extname(f).toLowerCase()))
	.sort();

fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2) + '\n');
console.log(`Generated library/manifest.json with ${files.length} photo(s): ${files.join(', ')}`);
