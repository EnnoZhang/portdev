/**
 * Database initialization using better-sqlite3
 * All data is stored in a local SQLite file — no external DB needed.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'portfolio.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    description TEXT    NOT NULL,
    tags        TEXT    DEFAULT '[]',
    image_url   TEXT,
    project_url TEXT,
    featured    INTEGER DEFAULT 0,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now')),
    updated_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT,
    message    TEXT NOT NULL,
    ip         TEXT,
    read       INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS profile (
    id          INTEGER PRIMARY KEY CHECK (id = 1),
    name        TEXT DEFAULT 'Your Name',
    tagline     TEXT DEFAULT 'UI/UX 设计师 & 全栈开发者',
    bio         TEXT DEFAULT '热爱用代码和设计创造有温度的数字体验',
    bio_detail  TEXT DEFAULT '',
    email       TEXT DEFAULT 'hello@yourname.com',
    phone       TEXT DEFAULT '',
    github_url  TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    avatar_url  TEXT DEFAULT '',
    years_exp   INTEGER DEFAULT 5,
    projects_count INTEGER DEFAULT 30,
    clients_count  INTEGER DEFAULT 20,
    updated_at  TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS skills (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    description TEXT,
    icon        TEXT,
    tags        TEXT DEFAULT '[]',
    sort_order  INTEGER DEFAULT 0
  );
`);

// ── Seed default data if empty ────────────────────────────────────────────────

const profileCount = db.prepare('SELECT COUNT(*) as c FROM profile').get().c;
if (profileCount === 0) {
  db.prepare(`
    INSERT INTO profile (id, name, tagline, bio, bio_detail, email, github_url, years_exp, projects_count, clients_count)
    VALUES (1, 'Your Name', 'UI/UX 设计师 & 全栈开发者',
      '热爱用代码和设计创造有温度的数字体验',
      '我是一名专注于用户体验与前端开发的设计师，拥有超过 5 年的行业经验。我相信好的设计不仅仅是视觉上的美感，更是解决问题的工具。',
      'hello@yourname.com', 'https://github.com', 5, 30, 20)
  `).run();
}

const skillsCount = db.prepare('SELECT COUNT(*) as c FROM skills').get().c;
if (skillsCount === 0) {
  const insertSkill = db.prepare(`
    INSERT INTO skills (title, description, icon, tags, sort_order) VALUES (?, ?, ?, ?, ?)
  `);
  const seedSkills = db.transaction(() => {
    insertSkill.run('UI/UX 设计', '从用户研究到原型设计，打造以用户为中心的界面体验。', 'layers', '["Figma","Sketch","Prototyping"]', 1);
    insertSkill.run('前端开发', '使用现代技术栈构建高性能、响应式的 Web 应用。', 'code', '["React","Vue","TypeScript"]', 2);
    insertSkill.run('后端开发', '构建稳定可靠的服务端架构与 API 接口。', 'monitor', '["Node.js","Express","MongoDB"]', 3);
    insertSkill.run('品牌设计', '为品牌打造一致、有辨识度的视觉语言体系。', 'shield', '["Logo","Brand Identity","Motion"]', 4);
  });
  seedSkills();
}

const projectsCount = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
if (projectsCount === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (title, category, description, tags, project_url, featured, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const seedProjects = db.transaction(() => {
    insertProject.run('电商平台重设计', 'design', '为某电商平台进行全面的用户体验优化，提升转化率 40%。', '["UI/UX","Figma","用户研究"]', '#', 0, 1);
    insertProject.run('SaaS 管理系统', 'dev', '从零构建的企业级 SaaS 平台，支持多租户与权限管理。', '["Node.js","React","PostgreSQL"]', '#', 1, 2);
    insertProject.run('科技公司品牌升级', 'brand', '为初创科技公司打造完整品牌视觉体系，包含 VI 手册。', '["品牌设计","Logo","VI"]', '#', 0, 3);
    insertProject.run('健康追踪 App', 'design', 'iOS/Android 双端健康管理应用，荣获 App Store 精选推荐。', '["移动端","iOS","Android"]', '#', 0, 4);
    insertProject.run('数据可视化平台', 'dev', '基于 D3.js 的实时数据可视化大屏，支持多维度数据分析。', '["D3.js","数据可视化","前端"]', '#', 0, 5);
    insertProject.run('餐饮品牌全案', 'brand', '从品牌策略到视觉落地，打造有温度的餐饮品牌形象。', '["品牌策略","视觉设计","包装"]', '#', 0, 6);
  });
  seedProjects();
}

module.exports = db;
