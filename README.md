# 个人作品集网站

一个简洁大气的全栈个人作品集网站，参考 Strikingly 设计风格。

## 功能特性

### 前端
- ✨ 响应式设计，支持移动端
- 🎨 简洁大气的 UI，渐变色卡片
- 🔄 平滑滚动与动画效果
- 📱 移动端汉堡菜单
- 📧 联系表单（实时验证）
- 🎯 作品分类筛选
- 💬 客户评价轮播

### 后端
- 🗄️ SQLite 数据库（无需额外安装）
- 🔐 JWT 身份验证
- 📊 完整的管理后台
- 📨 联系表单提交（可选邮件通知）
- 🖼️ 图片上传功能
- 🛡️ 安全防护（Helmet + CORS + Rate Limit）
- 📡 RESTful API

### 管理后台
- 📬 消息管理（查看、标记已读、删除）
- 🎨 作品管理（增删改查）
- 💼 技能管理
- 👤 个人信息编辑
- 🔒 安全登录

## 技术栈

- **后端**: Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **前端**: 原生 HTML/CSS/JavaScript
- **认证**: JWT
- **安全**: Helmet, CORS, express-rate-limit
- **邮件**: Nodemailer（可选）

## 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 配置环境变量

复制 `.env.example` 为 `.env`，修改配置：

\`\`\`env
PORT=3001
NODE_ENV=development

# 管理员账号（请修改！）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_strong_password

# JWT 密钥（生产环境必须修改！）
JWT_SECRET=your_jwt_secret_key

# 邮件通知（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
NOTIFY_EMAIL=your@gmail.com
\`\`\`

### 3. 启动服务

\`\`\`bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
\`\`\`

### 4. 访问网站

- **前台**: http://localhost:3001
- **管理后台**: http://localhost:3001/admin.html
- **默认账号**: admin / admin123（请立即修改！）

## API 文档

### 公开 API

\`\`\`
GET  /api/profile          # 获取个人信息
GET  /api/skills           # 获取技能列表
GET  /api/projects         # 获取作品列表（可选 ?category=design|dev|brand）
POST /api/contact          # 提交联系表单
\`\`\`

### 管理 API（需要 JWT）

\`\`\`
POST   /api/admin/login                    # 登录
GET    /api/admin/messages                 # 获取消息列表
PATCH  /api/admin/messages/:id/read        # 标记已读
DELETE /api/admin/messages/:id             # 删除消息
GET    /api/admin/projects                 # 获取作品
POST   /api/admin/projects                 # 新增作品
PUT    /api/admin/projects/:id             # 更新作品
DELETE /api/admin/projects/:id             # 删除作品
GET    /api/admin/skills                   # 获取技能
POST   /api/admin/skills                   # 新增技能
PUT    /api/admin/skills/:id               # 更新技能
DELETE /api/admin/skills/:id               # 删除技能
GET    /api/admin/profile                  # 获取个人信息
PUT    /api/admin/profile                  # 更新个人信息
POST   /api/admin/upload                   # 上传图片
\`\`\`


### 服务器 PaaS 平台（最简单）

**Railway**：
- 免费额度：$5/月
- 优点：零配置部署，自动 HTTPS
- 适合：快速上线

### 部署步骤

#### 使用 Railway（推荐新手）

1. 注册 Railway 账号
2. 连接 GitHub 仓库
3. 添加环境变量（`.env` 内容），**`NODE_ENV=production`**
4. 在 Railway 服务设置中确认：
   - **Build Command**：`npm run build`（`public/` 不在 git 中，必须构建）
   - **Start Command**：`npm start`（只起一个 Node 进程，同时提供 API + 静态页）
5. 访问 **前台** `https://你的域名/`、**后台** `https://你的域名/admin.html`（无需再单独起 Vite）

若主页仍黑屏：部署后 **硬刷新**（Ctrl+F5），或清空站点缓存；旧版 `main-*.js` 可能仍触发 CSP 的 `unsafe-eval` 报错。

#### 使用 VPS（传统方式）

\`\`\`bash
# 1. 连接服务器
ssh root@your_server_ip

# 2. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# 3. 克隆代码
git clone your_repo_url
cd portfolio-website

# 4. 安装依赖
npm install --production

# 5. 配置环境变量
nano .env  # 修改配置

# 6. 使用 PM2 守护进程
npm install -g pm2
pm2 start server.js --name portfolio
pm2 startup
pm2 save

# 7. 配置 Nginx 反向代理（可选）
apt-get install nginx
nano /etc/nginx/sites-available/portfolio
# 配置反向代理到 localhost:3001
nginx -t && systemctl reload nginx
\`\`\`

## 安全建议

1. **修改默认密码**：立即修改 `.env` 中的 `ADMIN_PASSWORD`
2. **更换 JWT 密钥**：生产环境必须使用强随机密钥
3. **启用 HTTPS**：使用 Let's Encrypt 免费证书
4. **定期备份**：备份 `data/portfolio.db` 数据库文件
5. **限制上传**：图片上传已限制 5MB，可根据需要调整

## 自定义

### 修改个人信息
登录管理后台 → 个人信息 → 编辑保存

### 添加作品
登录管理后台 → 作品管理 → 新增作品

### 修改配色
编辑 `public/css/style.css` 中的 CSS 变量：
\`\`\`css
:root {
  --color-accent: #e8d5b7;  /* 主色调 */
  --color-accent-2: #c9a96e; /* 辅助色 */
}
\`\`\`

## 常见问题

**Q: 如何重置管理员密码？**  
A: 修改 `.env` 文件中的 `ADMIN_PASSWORD`，重启服务器。

**Q: 数据库文件在哪里？**  
A: `data/portfolio.db`，可以直接备份这个文件。

**Q: 如何配置邮件通知？**  
A: 填写 `.env` 中的 SMTP 配置。Gmail 需要使用应用专用密码。

**Q: 支持多语言吗？**  
A: 目前仅支持中文，可以手动修改 HTML 文本实现多语言。

## License

MIT

---

**祝你部署顺利！有问题欢迎提 Issue。**
