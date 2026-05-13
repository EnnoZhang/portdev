import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { Profile, Skill, Project, ProjectCategory } from '@/types'

export const usePortfolioStore = defineStore('portfolio', () => {
  const profile = ref<Profile | null>(null)
  const skills = ref<Skill[]>([])
  const projects = ref<Project[]>([])
  const activeCategory = ref<ProjectCategory>('all')
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [profileRes, skillsRes, projectsRes] = await Promise.all([
        api.getProfile(),
        api.getSkills(),
        api.getProjects(),
      ])
      if (profileRes.success && profileRes.data) profile.value = profileRes.data
      if (skillsRes.success && skillsRes.data) skills.value = skillsRes.data
      if (projectsRes.success && projectsRes.data) projects.value = projectsRes.data
    } catch (e) {
      error.value = 'Failed to load data'
      console.warn('Portfolio data load failed:', e)
    } finally {
      loading.value = false
    }
  }

  const filteredProjects = () =>
    activeCategory.value === 'all'
      ? projects.value
      : projects.value.filter(p => p.category === activeCategory.value)

  function setCategory(cat: ProjectCategory) {
    activeCategory.value = cat
  }

  return { profile, skills, projects, activeCategory, loading, error, fetchAll, filteredProjects, setCategory }
})
