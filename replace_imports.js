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

    content = content.replace(/@\/lib\/supabase\/client/g, '@/services/supabase/client');
    content = content.replace(/@\/lib\/supabase\/server/g, '@/services/supabase/server');
    content = content.replace(/@\/lib\/supabase\/middleware/g, '@/services/supabase/middleware');
    content = content.replace(/@\/lib\/database\/actions/g, '@/services/supabase/actions');
    content = content.replace(/@\/lib\/services\/emissionService/g, '@/services/carbon/emissionService');
    content = content.replace(/@\/lib\/utils/g, '@/utils');
    content = content.replace(/@\/lib\/security\/rateLimit/g, '@/utils/rateLimit');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log('Updated', filePath);
    }
  }
});
