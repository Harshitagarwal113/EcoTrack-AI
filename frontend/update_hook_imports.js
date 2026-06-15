const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  content = content.replace(/@\/hooks\/useCarbonTracker/g, '@/features/carbon/hooks/use-carbon-tracker.hook');
  content = content.replace(/@\/hooks\/useReceiptScanner/g, '@/features/scanner/hooks/use-receipt-scanner.hook');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated hook imports in: ${filePath}`);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath);
    } else if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx')) {
      processFile(dirPath);
    }
  });
}

walk('./src');
