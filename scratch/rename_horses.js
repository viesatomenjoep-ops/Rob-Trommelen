const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '..');
const excludes = ['.git', 'node_modules', '.next', '.vercel', 'scratch', 'package-lock.json', 'README_SETUP.md'];

function renameInContent(filePath) {
  const ext = path.extname(filePath);
  if (['.tsx', '.ts', '.jsx', '.js', '.css', '.md', '.sql', '.json'].includes(ext)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We should be careful with JSON or lock files, but we excluded package-lock.json.
    // Let's only do simple string replaces.
    let newContent = content.replace(/horses/g, 'properties');
    newContent = newContent.replace(/Horses/g, 'Properties');
    newContent = newContent.replace(/horse/g, 'property');
    newContent = newContent.replace(/Horse/g, 'Property');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }
}

function walkAndRename(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (excludes.includes(file)) continue;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkAndRename(fullPath);
    } else {
      renameInContent(fullPath);
    }
  }
}

function walkAndRenameFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (excludes.includes(file)) continue;
      
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      let newName = file;
      if (newName.includes('horses')) newName = newName.replace(/horses/g, 'properties');
      if (newName.includes('Horses')) newName = newName.replace(/Horses/g, 'Properties');
      if (newName.includes('horse')) newName = newName.replace(/horse/g, 'property');
      if (newName.includes('Horse')) newName = newName.replace(/Horse/g, 'Property');
      
      let finalPath = fullPath;
      if (newName !== file) {
          const newFullPath = path.join(dir, newName);
          fs.renameSync(fullPath, newFullPath);
          finalPath = newFullPath;
      }
      
      if (stat.isDirectory()) {
        walkAndRenameFiles(finalPath);
      }
    }
}

console.log('Replacing content...');
walkAndRename(targetDir);
console.log('Renaming files and folders...');
walkAndRenameFiles(targetDir);
console.log('Done!');
