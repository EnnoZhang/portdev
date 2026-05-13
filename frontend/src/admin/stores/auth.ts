import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { adminApi } from '@/api'

const TOKEN_KEY = 'portfolio_admin_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const isLoggedIn = computed(() => !!token.value)

  async function login(username: string, password: string): Promise<string | null> {
    const result = await adminApi.login(username, password)
    // Backend returns { success, token } directly (not nested in data)
    const token_value = (result as any).token ?? result.data?.token
    if (result.success && token_value) {
      token.value = token_value
      localStorage.setItem(TOKEN_KEY, token_value)
      return null
    }
    return result.message || '登录失败'
  }

  async function checkAuth(): Promise<boolean> {
    if (!token.value) return false
    const result = await adminApi.getProfile(token.value)
    if (!result.success) { logout(); return false }
    return true
  }

  function logout() {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, isLoggedIn, login, checkAuth, logout }
})
