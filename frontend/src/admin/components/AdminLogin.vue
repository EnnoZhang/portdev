<template>
  <div class="login-screen">
    <div class="login-card">
      <h1>管理后台</h1>
      <p>请登录以管理你的作品集</p>
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="username">用户名</label>
          <input id="username" v-model="username" type="text" autocomplete="username" required />
        </div>
        <div class="field">
          <label for="password">密码</label>
          <input id="password" v-model="password" type="password" autocomplete="current-password" required />
        </div>
        <div class="login-error">{{ errorMsg }}</div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  const err = await auth.login(username.value, password.value)
  if (err) errorMsg.value = err
  loading.value = false
}
</script>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse 60% 60% at 50% 0%, rgba(232,213,183,0.06) 0%, transparent 60%);
}
.login-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 380px;
}
.login-card h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.login-card p { color: var(--muted); font-size: 0.875rem; margin-bottom: 2rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.field label { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
.field input {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  color: var(--text);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--tr);
}
.field input:focus { border-color: rgba(232,213,183,0.4); }
.login-error { color: var(--danger); font-size: 0.8rem; min-height: 1.2rem; margin-bottom: 0.5rem; }
.btn-primary {
  width: 100%;
  background: var(--accent);
  color: #0a0a0a;
  padding: 0.625rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--tr);
}
.btn-primary:hover:not(:disabled) { background: var(--accent2); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
