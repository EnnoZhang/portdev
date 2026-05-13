import type { ApiResponse, Profile, Skill, Project, ContactForm } from '@/types'

const BASE = '/api'

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  token?: string,
): Promise<ApiResponse<T> & Record<string, unknown>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  return data
}

// ── Public API ────────────────────────────────────────────────────────────────
export const api = {
  getProfile: () => request<Profile>('GET', '/profile'),
  getSkills: () => request<Skill[]>('GET', '/skills'),
  getProjects: (category?: string) =>
    request<Project[]>('GET', `/projects${category && category !== 'all' ? `?category=${category}` : ''}`),
  submitContact: (form: ContactForm) => request('POST', '/contact', form),
}

// ── Admin API ─────────────────────────────────────────────────────────────────
export const adminApi = {
  login: (username: string, password: string) =>
    request<{ token: string }>('POST', '/admin/login', { username, password }),

  // Profile
  getProfile: (token: string) => request<Profile>('GET', '/admin/profile', undefined, token),
  updateProfile: (data: Partial<Profile>, token: string) =>
    request('PUT', '/admin/profile', data, token),

  // Projects
  getProjects: (token: string) => request<Project[]>('GET', '/admin/projects', undefined, token),
  createProject: (data: Partial<Project>, token: string) =>
    request<{ id: number }>('POST', '/admin/projects', data, token),
  updateProject: (id: number, data: Partial<Project>, token: string) =>
    request('PUT', `/admin/projects/${id}`, data, token),
  deleteProject: (id: number, token: string) =>
    request('DELETE', `/admin/projects/${id}`, undefined, token),

  // Skills
  getSkills: (token: string) => request<Skill[]>('GET', '/admin/skills', undefined, token),
  createSkill: (data: Partial<Skill>, token: string) =>
    request<{ id: number }>('POST', '/admin/skills', data, token),
  updateSkill: (id: number, data: Partial<Skill>, token: string) =>
    request('PUT', `/admin/skills/${id}`, data, token),
  deleteSkill: (id: number, token: string) =>
    request('DELETE', `/admin/skills/${id}`, undefined, token),

  // Messages
  getMessages: (token: string, unreadOnly = false) =>
    request<import('@/types').Message[]>(
      'GET',
      `/admin/messages${unreadOnly ? '?unread=1' : ''}`,
      undefined,
      token,
    ),
  markRead: (id: number, token: string) =>
    request('PATCH', `/admin/messages/${id}/read`, undefined, token),
  deleteMessage: (id: number, token: string) =>
    request('DELETE', `/admin/messages/${id}`, undefined, token),

  // Upload
  uploadImage: async (file: File, token: string): Promise<string | null> => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await res.json()
    return data.success ? data.url : null
  },
}
