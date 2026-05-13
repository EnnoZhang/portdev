/**
 * Admin API routes (JWT protected)
 *
 * POST /api/admin/login
 *
 * Projects:
 *   GET    /api/admin/projects
 *   POST   /api/admin/projects
 *   PUT    /api/admin/projects/:id
 *   DELETE /api/admin/projects/:id
 *
 * Messages:
 *   GET    /api/admin/messages
 *   PATCH  /api/admin/messages/:id/read
 *   DELETE /api/admin/messages/:id
 *
 * Profile:
 *   GET    /api/admin/profile
 *   PUT    /api/admin/profile
 *
 * Skills:
 *   GET    /api/admin/skills
 *   POST   /api/admin/skills
 *   PUT    /api/admin/skills/:id
 *   DELETE /api/admin/skills/:id
 *
 * Upload:
 *   POST   /api/admin/upload
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = '7d';

// ── Multer setup ──────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

// ── Auth middleware ───────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const token = authHeader.slice(7);
  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token 无效或已过期' });
  }
}

// ── POST /api/admin/login ─────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.json({ success: true, token });
  }
  res.status(401).json({ success: false, message: '用户名或密码错误' });
});

// ── All routes below require auth ─────────────────────────────────────────────
router.use(requireAuth);

// ── Projects ──────────────────────────────────────────────────────────────────
router.get('/projects', (req, res) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC').all();
  res.json({ success: true, data: rows.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') })) });
});

router.post('/projects', (req, res) => {
  const { title, category, description, tags, image_url, project_url, featured, sort_order } = req.body;
  if (!title || !category || !description) {
    return res.status(400).json({ success: false, message: '标题、分类和描述为必填项' });
  }
  const result = db.prepare(`
    INSERT INTO projects (title, category, description, tags, image_url, project_url, featured, sort_order)
    VALUES (@title, @category, @description, @tags, @image_url, @project_url, @featured, @sort_order)
  `).run({
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    tags: JSON.stringify(Array.isArray(tags) ? tags : []),
    image_url: image_url || null,
    project_url: project_url || null,
    featured: featured ? 1 : 0,
    sort_order: sort_order || 0,
  });
  res.status(201).json({ success: true, id: result.lastInsertRowid });
});

router.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, description, tags, image_url, project_url, featured, sort_order } = req.body;
  const existing = db.prepare('SELECT id FROM projects WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ success: false, message: '项目不存在' });

  db.prepare(`
    UPDATE projects SET
      title = @title, category = @category, description = @description,
      tags = @tags, image_url = @image_url, project_url = @project_url,
      featured = @featured, sort_order = @sort_order,
      updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id,
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    tags: JSON.stringify(Array.isArray(tags) ? tags : []),
    image_url: image_url || null,
    project_url: project_url || null,
    featured: featured ? 1 : 0,
    sort_order: sort_order || 0,
  });
  res.json({ success: true });
});

router.delete('/projects/:id', (req, res) => {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ success: false, message: '项目不存在' });
  res.json({ success: true });
});

// ── Messages ──────────────────────────────────────────────────────────────────
router.get('/messages', (req, res) => {
  const { unread } = req.query;
  let stmt = unread === '1'
    ? db.prepare('SELECT * FROM messages WHERE read = 0 ORDER BY created_at DESC')
    : db.prepare('SELECT * FROM messages ORDER BY created_at DESC');
  res.json({ success: true, data: stmt.all() });
});

router.patch('/messages/:id/read', (req, res) => {
  db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.delete('/messages/:id', (req, res) => {
  const result = db.prepare('DELETE FROM messages WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ success: false, message: '消息不存在' });
  res.json({ success: true });
});

// ── Profile ───────────────────────────────────────────────────────────────────
router.get('/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json({ success: true, data: profile });
});

router.put('/profile', (req, res) => {
  const fields = ['name', 'tagline', 'bio', 'bio_detail', 'email', 'phone',
    'github_url', 'linkedin_url', 'avatar_url', 'years_exp', 'projects_count', 'clients_count'];
  const data = { id: 1 };
  fields.forEach(f => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
  data.updated_at = new Date().toISOString();

  const setClauses = Object.keys(data).filter(k => k !== 'id').map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE profile SET ${setClauses} WHERE id = 1`).run(data);
  res.json({ success: true });
});

// ── Skills ────────────────────────────────────────────────────────────────────
router.get('/skills', (req, res) => {
  const rows = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
  res.json({ success: true, data: rows.map(s => ({ ...s, tags: JSON.parse(s.tags || '[]') })) });
});

router.post('/skills', (req, res) => {
  const { title, description, icon, tags, sort_order } = req.body;
  if (!title) return res.status(400).json({ success: false, message: '标题为必填项' });
  const result = db.prepare(`
    INSERT INTO skills (title, description, icon, tags, sort_order)
    VALUES (@title, @description, @icon, @tags, @sort_order)
  `).run({
    title: title.trim(),
    description: (description || '').trim(),
    icon: icon || 'code',
    tags: JSON.stringify(Array.isArray(tags) ? tags : []),
    sort_order: sort_order || 0,
  });
  res.status(201).json({ success: true, id: result.lastInsertRowid });
});

router.put('/skills/:id', (req, res) => {
  const { title, description, icon, tags, sort_order } = req.body;
  const existing = db.prepare('SELECT id FROM skills WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: '技能不存在' });
  db.prepare(`
    UPDATE skills SET title = @title, description = @description, icon = @icon,
      tags = @tags, sort_order = @sort_order WHERE id = @id
  `).run({
    id: req.params.id,
    title: title.trim(),
    description: (description || '').trim(),
    icon: icon || 'code',
    tags: JSON.stringify(Array.isArray(tags) ? tags : []),
    sort_order: sort_order || 0,
  });
  res.json({ success: true });
});

router.delete('/skills/:id', (req, res) => {
  const result = db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ success: false, message: '技能不存在' });
  res.json({ success: true });
});

// ── Upload ────────────────────────────────────────────────────────────────────
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: '未收到文件' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

module.exports = router;
