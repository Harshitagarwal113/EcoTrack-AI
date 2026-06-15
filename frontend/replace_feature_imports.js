const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walk('./src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    content = content.replace(/@\/components\/dashboard/g, '@/features/dashboard/components');
    content = content.replace(/@\/components\/settings/g, '@/features/settings/components');
    content = content.replace(/@\/components\/auth/g, '@/features/auth/components');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Updated', filePath);
    }
  }
});
