<template>
  <div class="admin-app">
    <aside class="sidebar">
      <div class="sidebar-logo">Admin</div>
      <nav class="sidebar-nav">
        <button
          v-for="item in tabs"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeTab === item.key }"
          @click="activeTab = item.key"
        >
          <span v-html="item.icon" class="nav-icon" />
          {{ item.label }}
          <span v-if="item.key === 'messages' && unreadCount" class="badge">{{ unreadCount }}</span>
        </button>
      </nav>
      <button class="logout-btn" @click="auth.logout()">退出登录</button>
    </aside>

    <main class="admin-main">
      <KeepAlive>
        <component :is="currentPanel" />
      </KeepAlive>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAdminStore } from '../stores/admin'

const auth = useAuthStore()
const adminStore = useAdminStore()
const activeTab = ref('messages')

const unreadCount = computed(() =>
  adminStore.messages.filter(m => !m.read).length || 0
)

const tabs = [
  { key: 'messages', label: '消息', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>` },
  { key: 'projects', label: '作品', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>` },
  { key: 'skills',   label: '技能', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>` },
  { key: 'profile',  label: '个人信息', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>` },
]

const panels: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  messages: defineAsyncComponent(() => import('./panels/MessagesPanel.vue')),
  projects: defineAsyncComponent(() => import('./panels/ProjectsPanel.vue')),
  skills:   defineAsyncComponent(() => import('./panels/SkillsPanel.vue')),
  profile:  defineAsyncComponent(() => import('./panels/ProfilePanel.vue')),
}

const currentPanel = computed(() => panels[activeTab.value])
</script>

<style scoped>
.admin-app { display: flex; min-height: 100vh; }
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--bg2);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  position: sticky;
  top: 0;
  height: 100vh;
}
.sidebar-logo { font-size: 1.1rem; font-weight: 700; color: var(--accent); padding: 0 0.5rem; margin-bottom: 2rem; }
.sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--muted);
  transition: all var(--tr);
  position: relative;
}
.nav-icon { width: 16px; height: 16px; flex-shrink: 0; display: flex; }
.nav-icon :deep(svg) { width: 16px; height: 16px; }
.nav-item:hover { background: var(--bg3); color: var(--text); }
.nav-item.active { background: rgba(232,213,183,0.1); color: var(--accent); }
.badge {
  margin-left: auto;
  background: var(--danger);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 50px;
  min-width: 18px;
  text-align: center;
}
.logout-btn {
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  color: var(--muted);
  transition: all var(--tr);
  text-align: left;
}
.logout-btn:hover { color: var(--danger); }
.admin-main { flex: 1; padding: 2rem; overflow-y: auto; }
</style>
