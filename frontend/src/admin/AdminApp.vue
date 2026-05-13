<template>
  <div class="admin-root">
    <AdminLogin v-if="!auth.isLoggedIn" />
    <AdminLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import AdminLogin from './components/AdminLogin.vue'
import AdminLayout from './components/AdminLayout.vue'

const auth = useAuthStore()
onMounted(() => auth.checkAuth())
</script>

<style>
/* Admin global styles */
:root {
  --bg: #0f0f0f;
  --bg2: #161616;
  --bg3: #1e1e1e;
  --border: rgba(255,255,255,0.08);
  --text: #f0f0f0;
  --muted: #888;
  --accent: #e8d5b7;
  --accent2: #c9a96e;
  --danger: #e05252;
  --success: #43e97b;
  --font: 'Inter', sans-serif;
  --radius: 10px;
  --tr: 0.2s ease;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; }
button { cursor: pointer; border: none; background: none; font-family: inherit; color: inherit; }
input, textarea, select { font-family: inherit; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
</style>
