#!/usr/bin/env node

/**
 * 批量更新主题样式脚本
 * 将项目中的重复主题样式类替换为封装好的主题类
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 样式替换映射
const styleReplacements = [
  // 页面标题
  {
    search: /class="text-2xl font-bold text-gray-900 dark:text-white"/g,
    replace: 'class="page-title"'
  },
  {
    search: /class="mt-1 text-sm text-gray-500 dark:text-gray-400"/g,
    replace: 'class="page-subtitle"'
  },
  
  // 卡片容器
  {
    search: /class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"/g,
    replace: 'class="theme-card"'
  },
  {
    search: /class="card"/g,
    replace: 'class="theme-card"'
  },
  
  // 表格样式
  {
    search: /class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"/g,
    replace: 'class="theme-table"'
  },
  {
    search: /class="bg-gray-50 dark:bg-gray-800"/g,
    replace: 'class="theme-table-header"'
  },
  {
    search: /class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"/g,
    replace: 'class="theme-table-header-cell"'
  },
  {
    search: /class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"/g,
    replace: 'class="theme-table-body"'
  },
  {
    search: /class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"/g,
    replace: 'class="theme-table-cell"'
  },
  {
    search: /class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"/g,
    replace: 'class="theme-table-cell-secondary"'
  },
  
  // 文本样式
  {
    search: /class="text-gray-900 dark:text-white"/g,
    replace: 'class="theme-text-primary"'
  },
  {
    search: /class="text-gray-500 dark:text-gray-400"/g,
    replace: 'class="theme-text-secondary"'
  },
  {
    search: /class="text-gray-400 dark:text-gray-500"/g,
    replace: 'class="theme-text-muted"'
  },
  
  // 状态样式
  {
    search: /class="bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200"/g,
    replace: 'class="status-success"'
  },
  {
    search: /class="bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200"/g,
    replace: 'class="status-warning"'
  },
  {
    search: /class="bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200"/g,
    replace: 'class="status-danger"'
  },
  
  // 收益率颜色
  {
    search: /class="text-success-600 dark:text-success-400"/g,
    replace: 'class="return-positive"'
  },
  {
    search: /class="text-danger-600 dark:text-danger-400"/g,
    replace: 'class="return-negative"'
  },
  
  // 信息框
  {
    search: /class="p-4 bg-blue-50 dark:bg-blue-900\/20 rounded-lg"/g,
    replace: 'class="info-box info-box-blue"'
  },
  {
    search: /class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2"/g,
    replace: 'class="info-box-title info-box-title-blue"'
  },
  {
    search: /class="text-sm text-blue-700 dark:text-blue-300"/g,
    replace: 'class="info-box-text info-box-text-blue"'
  },
  {
    search: /class="p-4 bg-yellow-50 dark:bg-yellow-900\/20 rounded-lg"/g,
    replace: 'class="info-box info-box-yellow"'
  },
  {
    search: /class="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2"/g,
    replace: 'class="info-box-title info-box-title-yellow"'
  },
  {
    search: /class="text-sm text-yellow-700 dark:text-yellow-300"/g,
    replace: 'class="info-box-text info-box-text-yellow"'
  }
];

// 获取所有 Vue 文件
function getVueFiles() {
  return glob.sync('src/**/*.vue', { 
    ignore: ['node_modules/**', 'dist/**'] 
  });
}

// 更新单个文件
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    styleReplacements.forEach(({ search, replace }) => {
      if (search.test(content)) {
        content = content.replace(search, replace);
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// 主函数
function main() {
  console.log('🚀 开始批量更新主题样式...\n');
  
  const vueFiles = getVueFiles();
  let updatedCount = 0;
  
  vueFiles.forEach(filePath => {
    if (updateFile(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`\n✨ 完成！共更新了 ${updatedCount} 个文件`);
  console.log(`📁 总共检查了 ${vueFiles.length} 个 Vue 文件`);
  
  if (updatedCount > 0) {
    console.log('\n📋 建议执行以下操作：');
    console.log('1. 检查更新后的文件是否正确');
    console.log('2. 运行 npm run dev 测试应用');
    console.log('3. 检查浅色和深色主题切换是否正常');
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  styleReplacements,
  updateFile,
  getVueFiles
};