/**
 * Public API routes
 * GET  /api/profile
 * GET  /api/skills
 * GET  /api/projects          ?category=all|design|dev|brand
 * POST /api/contact
 */

const express = require('express');
const router = express.Router();
const db = require('../db');
const rateLimit = require('express-rate-limit');

// Rate limit for contact form: 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: '提交过于频繁，请 15 分钟后再试。' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── GET /api/profile ──────────────────────────────────────────────────────────
router.get('/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();
  res.json({ success: true, data: profile });
});

// ── GET /api/skills ───────────────────────────────────────────────────────────
router.get('/skills', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order ASC').all();
  const parsed = skills.map(s => ({ ...s, tags: JSON.parse(s.tags || '[]') }));
  res.json({ success: true, data: parsed });
});

// ── GET /api/projects ─────────────────────────────────────────────────────────
router.get('/projects', (req, res) => {
  const { category } = req.query;
  let stmt;
  if (!category || category === 'all') {
    stmt = db.prepare('SELECT * FROM projects ORDER BY sort_order ASC');
  } else {
    stmt = db.prepare('SELECT * FROM projects WHERE category = ? ORDER BY sort_order ASC');
  }
  const rows = category && category !== 'all'
    ? stmt.all(category)
    : stmt.all();
  const parsed = rows.map(p => ({ ...p, tags: JSON.parse(p.tags || '[]') }));
  res.json({ success: true, data: parsed });
});

// ── POST /api/contact ─────────────────────────────────────────────────────────
router.post('/contact', contactLimiter, (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validation
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = '姓名至少需要 2 个字符';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = '请输入有效的邮箱地址';
  if (!message || message.trim().length < 10) errors.message = '消息内容至少需要 10 个字符';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Sanitize inputs
  const safeData = {
    name: name.trim().slice(0, 100),
    email: email.trim().slice(0, 200),
    subject: (subject || '').trim().slice(0, 200),
    message: message.trim().slice(0, 5000),
    ip: req.ip,
  };

  try {
    const result = db.prepare(`
      INSERT INTO messages (name, email, subject, message, ip)
      VALUES (@name, @email, @subject, @message, @ip)
    `).run(safeData);

    // Send email notification if configured (non-blocking)
    sendEmailNotification(safeData).catch(() => {});

    res.json({
      success: true,
      message: '消息已收到，我会尽快回复你！',
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ success: false, message: '服务器错误，请稍后再试。' });
  }
});

// ── Email notification (optional) ────────────────────────────────────────────
async function sendEmailNotification(data) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Portfolio" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `[作品集] 新消息来自 ${data.name}`,
    html: `
      <h3>新联系消息</h3>
      <p><strong>姓名：</strong>${data.name}</p>
      <p><strong>邮箱：</strong>${data.email}</p>
      <p><strong>主题：</strong>${data.subject || '无'}</p>
      <p><strong>内容：</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `,
  });
}

module.exports = router;
