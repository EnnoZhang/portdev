/**
 * Railway / 生产启动前检查：public/ 由 vite build 生成且未纳入 git。
 * 若缺少构建产物则自动执行 npm run build，避免只跑 npm start 导致空目录或旧资源。
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const indexHtml = path.join(__dirname, '..', 'public', 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.log('\n⚠️  未找到 public/index.html，正在执行 npm run build …\n');
  execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}
