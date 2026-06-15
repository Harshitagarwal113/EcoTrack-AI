const fs = require('fs');
const path = require('path');

const fileMapping = {
  'fetchEmissionFactors': '@/features/carbon/services/carbon-calculation.service',
  'saveCarbonFootprint': '@/features/carbon/services/carbon-calculation.service',
  'getDashboardMetrics': '@/features/dashboard/services/dashboard-metrics.service',
  'getFootprintChartData': '@/features/dashboard/services/dashboard-metrics.service',
  'getStreaks': '@/features/dashboard/services/gamification.service',
  'updateActiveDaysStreak': '@/features/dashboard/services/gamification.service',
  'updateCompletedGoalsStreak': '@/features/dashboard/services/gamification.service',
  'updateCarbonReductionStreak': '@/features/dashboard/services/gamification.service',
  'getBadges': '@/features/dashboard/services/gamification.service',
  'evaluateBadges': '@/features/dashboard/services/gamification.service',
  'saveReceiptData': '@/features/scanner/services/receipt-processing.service',
  'getProfileStats': '@/features/goals/services/goals-management.service',
  'getGoals': '@/features/goals/services/goals-management.service',
  'createGoal': '@/features/goals/services/goals-management.service',
  'getGlobalChallenges': '@/features/community/services/community-challenges.service',
  'getUserChallenges': '@/features/community/services/community-challenges.service',
  'joinChallenge': '@/features/community/services/community-challenges.service',
  'getReportData': '@/features/analytics/services/analytics-report.service',
  'getNotifications': '@/features/settings/services/notification.service',
  'markNotificationAsRead': '@/features/settings/services/notification.service',
  'clearAllNotifications': '@/features/settings/services/notification.service',
  'evaluateAndGenerateReminders': '@/features/ai-coach/services/ai-recommendation.service'
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Handle both single and multiline imports
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@\/services\/supabase\/actions['"];/g;
  
  let match;
  let modifications = false;
  
  while ((match = importRegex.exec(content)) !== null) {
    const originalImport = match[0];
    const functions = match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    const importsByFile = {};
    functions.forEach(func => {
      const dest = fileMapping[func];
      if (dest) {
        if (!importsByFile[dest]) importsByFile[dest] = [];
        importsByFile[dest].push(func);
      } else {
        console.warn(`Unmapped function: ${func} in ${filePath}`);
      }
    });
    
    let newImports = '';
    for (const [dest, funcs] of Object.entries(importsByFile)) {
      newImports += `import { ${funcs.join(', ')} } from "${dest}";\n`;
    }
    
    content = content.replace(originalImport, newImports.trim());
    modifications = true;
  }
  
  if (modifications) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated imports in: ${filePath}`);
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
