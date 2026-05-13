// ── API Response wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string>
}

// ── Domain models ─────────────────────────────────────────────────────────────
export interface Profile {
  id: number
  name: string
  tagline: string
  bio: string
  bio_detail: string
  email: string
  phone: string
  github_url: string
  linkedin_url: string
  avatar_url: string
  years_exp: number
  projects_count: number
  clients_count: number
  updated_at: string
}

export interface Skill {
  id: number
  title: string
  description: string
  icon: SkillIcon
  tags: string[]
  sort_order: number
}

export type SkillIcon = 'layers' | 'code' | 'monitor' | 'shield'

export interface Project {
  id: number
  title: string
  category: ProjectCategory
  description: string
  tags: string[]
  image_url: string | null
  project_url: string | null
  featured: number
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProjectCategory = 'all' | 'design' | 'dev' | 'brand'

export interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  ip: string
  read: number
  created_at: string
}

// ── Contact form ──────────────────────────────────────────────────────────────
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  message?: string
}

// ── i18n locale ──────────────────────────────────────────────────────────────
export type Locale = 'zh' | 'en' | 'ja'
