import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminApi } from '@/api'
import { useAuthStore } from './auth'
import type { Message, Project, Skill, Profile } from '@/types'

export const useAdminStore = defineStore('admin', () => {
  const messages = ref<Message[]>([])
  const projects = ref<Project[]>([])
  const skills = ref<Skill[]>([])
  const profile = ref<Profile | null>(null)

  function getToken(): string {
    return useAuthStore().token ?? ''
  }

  async function fetchMessages(unreadOnly = false) {
    const res = await adminApi.getMessages(getToken(), unreadOnly)
    if (res.success && res.data) messages.value = res.data
  }

  async function fetchProjects() {
    const res = await adminApi.getProjects(getToken())
    if (res.success && res.data) projects.value = res.data
  }

  async function fetchSkills() {
    const res = await adminApi.getSkills(getToken())
    if (res.success && res.data) skills.value = res.data
  }

  async function fetchProfile() {
    const res = await adminApi.getProfile(getToken())
    if (res.success && res.data) profile.value = res.data
  }

  return { messages, projects, skills, profile, fetchMessages, fetchProjects, fetchSkills, fetchProfile }
})
