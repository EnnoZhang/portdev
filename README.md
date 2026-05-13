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
PORT=3000
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

- **前台**: http://localhost:3000
- **管理后台**: http://localhost:3000/admin.html
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

## 部署建议

### 域名推荐

**国内域名注册商**：
- 阿里云（万网）：.com 首年 ¥55，续费 ¥69/年
- 腾讯云：.com 首年 ¥35，续费 ¥69/年
- 西部数码：.com 首年 ¥45，续费 ¥69/年

**国外域名注册商**：
- Namecheap：.com 首年 $8.88，续费 $13.98/年
- Cloudflare：.com $9.77/年（无涨价）
- Porkbun：.com $9.13/年

**推荐域名后缀**：
- `.com` — 最通用，适合个人品牌
- `.dev` — 适合开发者（$12/年）
- `.me` — 适合个人网站（$20/年）
- `.design` — 适合设计师（$50/年）

### 服务器推荐

#### 1. 国内服务器（需备案）

**阿里云 ECS**：
- 轻量应用服务器：2核2G，3M带宽，¥60/年
- 适合：国内访问速度快

**腾讯云 CVM**：
- 轻量应用服务器：2核2G，4M带宽，¥50/年
- 新用户首年优惠

#### 2. 国外服务器（无需备案）

**Vultr**：
- 最低配：1核512M，$2.5/月（约 ¥18/月）
- 优点：按小时计费，可随时删除

**DigitalOcean**：
- 最低配：1核1G，$6/月（约 ¥43/月）
- 优点：稳定，文档丰富

**Linode (Akamai)**：
- 最低配：1核1G，$5/月（约 ¥36/月）
- 优点：性能好，网络稳定

**Hetzner**：
- 最低配：1核2G，€4.15/月（约 ¥32/月）
- 优点：性价比最高，欧洲机房

#### 3. PaaS 平台（最简单）

**Railway**：
- 免费额度：$5/月
- 优点：零配置部署，自动 HTTPS
- 适合：快速上线

**Render**：
- 免费套餐：512M 内存
- 优点：自动部署，免费 SSL
- 缺点：免费版会休眠

**Fly.io**：
- 免费额度：3个小应用
- 优点：全球 CDN，速度快

### 性价比推荐方案

**方案 1：最便宜（约 ¥150/年）**
- 域名：Cloudflare .com（¥70/年）
- 服务器：Vultr $2.5/月（¥216/年）
- 总计：¥286/年

**方案 2：国内访问快（约 ¥130/年）**
- 域名：腾讯云 .com 首年（¥35）
- 服务器：腾讯云轻量首年（¥50）
- 备案：免费
- 总计：¥85/年（首年），续费约 ¥130/年

**方案 3：零成本起步**
- 域名：Freenom 免费域名（.tk/.ml/.ga）
- 服务器：Render 免费套餐
- 总计：¥0（有限制）

### 部署步骤

#### 使用 Railway（推荐新手）

1. 注册 Railway 账号
2. 连接 GitHub 仓库
3. 添加环境变量（.env 内容）
4. 自动部署完成

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
# 配置反向代理到 localhost:3000
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
