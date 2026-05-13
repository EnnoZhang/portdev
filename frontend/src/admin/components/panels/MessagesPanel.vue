<template>
  <div>
    <div class="panel-header">
      <h2>联系消息</h2>
      <label class="toggle-label">
        <input type="checkbox" v-model="unreadOnly" @change="load" />
        只看未读
      </label>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!store.messages.length" class="empty-state">暂无消息</div>
    <div v-else>
      <div
        v-for="msg in store.messages"
        :key="msg.id"
        class="message-card"
        :class="{ unread: !msg.read }"
      >
        <div class="msg-header">
          <div class="msg-meta">
            <strong>{{ msg.name }}</strong>
            <span>{{ msg.email }}</span>
          </div>
          <div class="msg-actions">
            <button v-if="!msg.read" class="btn-ghost" @click="markRead(msg.id)">标为已读</button>
            <button class="btn-danger" @click="deleteMsg(msg.id)">删除</button>
          </div>
        </div>
        <div v-if="msg.subject" class="msg-subject">主题：{{ msg.subject }}</div>
        <div class="msg-body">{{ msg.message }}</div>
        <div class="msg-time">{{ formatDate(msg.created_at) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useAuthStore } from '../../stores/auth'
import { adminApi } from '@/api'

const store = useAdminStore()
const auth = useAuthStore()
const unreadOnly = ref(false)
const loading = ref(false)

async function load() {
  loading.value = true
  await store.fetchMessages(unreadOnly.value)
  loading.value = false
}

async function markRead(id: number) {
  await adminApi.markRead(id, auth.token!)
  await load()
}

async function deleteMsg(id: number) {
  if (!confirm('确认删除这条消息？')) return
  await adminApi.deleteMessage(id, auth.token!)
  await load()
}

function formatDate(str: string) {
  return new Date(str).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(load)
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.panel-header h2 { font-size: 1.25rem; font-weight: 600; }
.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--muted);
  cursor: pointer;
}
.empty-state { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.875rem; }
.message-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 0.75rem;
  transition: border-color var(--tr);
}
.message-card.unread { border-left: 3px solid var(--accent); }
.message-card:hover { border-color: rgba(232,213,183,0.2); }
.msg-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.msg-meta strong { font-size: 0.95rem; display: block; }
.msg-meta span { font-size: 0.8rem; color: var(--muted); }
.msg-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.msg-subject { font-size: 0.8rem; color: var(--accent2); margin-bottom: 0.5rem; }
.msg-body { font-size: 0.875rem; color: var(--muted); line-height: 1.6; white-space: pre-wrap; }
.msg-time { font-size: 0.75rem; color: var(--muted); margin-top: 0.75rem; }
.btn-ghost {
  background: var(--bg3);
  color: var(--text);
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid var(--border);
  transition: all var(--tr);
}
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger {
  background: rgba(224,82,82,0.15);
  color: var(--danger);
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.8rem;
  transition: all var(--tr);
}
.btn-danger:hover { background: rgba(224,82,82,0.25); }
</style>
