<template>
  <div>
    <div class="panel-header"><h2>个人信息</h2></div>
    <form class="profile-form" @submit.prevent="save" v-if="form">
      <div class="form-row">
        <div class="field"><label>姓名</label><input v-model="form.name" type="text" /></div>
        <div class="field"><label>标语</label><input v-model="form.tagline" type="text" /></div>
      </div>
      <div class="field"><label>简介（一句话）</label><input v-model="form.bio" type="text" /></div>
      <div class="field"><label>详细介绍</label><textarea v-model="form.bio_detail" rows="4" /></div>
      <div class="form-row">
        <div class="field"><label>邮箱</label><input v-model="form.email" type="email" /></div>
        <div class="field"><label>电话</label><input v-model="form.phone" type="text" /></div>
      </div>
      <div class="form-row">
        <div class="field"><label>GitHub</label><input v-model="form.github_url" type="url" /></div>
        <div class="field"><label>LinkedIn</label><input v-model="form.linkedin_url" type="url" /></div>
      </div>
      <div class="form-row">
        <div class="field"><label>年经验</label><input v-model.number="form.years_exp" type="number" min="0" /></div>
        <div class="field"><label>完成项目数</label><input v-model.number="form.projects_count" type="number" min="0" /></div>
        <div class="field"><label>客户数</label><input v-model.number="form.clients_count" type="number" min="0" /></div>
      </div>
      <div class="field">
        <label>头像 URL</label>
        <div class="upload-row">
          <input v-model="form.avatar_url" type="text" placeholder="https://..." />
          <label class="upload-btn">
            上传
            <input type="file" accept="image/*" style="display:none" @change="handleUpload" />
          </label>
        </div>
      </div>
      <div class="save-row">
        <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? '保存中...' : '保存' }}</button>
        <span class="save-msg" :class="{ error: saveError }">{{ saveMsg }}</span>
      </div>
    </form>
    <div v-else class="empty-state">加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useAuthStore } from '../../stores/auth'
import { adminApi } from '@/api'
import type { Profile } from '@/types'

const store = useAdminStore()
const auth = useAuthStore()
const saving = ref(false)
const saveMsg = ref('')
const saveError = ref(false)
const form = reactive<Partial<Profile>>({})

async function save() {
  saving.value = true
  const res = await adminApi.updateProfile({ ...form }, auth.token!)
  saving.value = false
  saveError.value = !res.success
  saveMsg.value = res.success ? '✓ 已保存' : '保存失败'
  if (res.success) setTimeout(() => { saveMsg.value = '' }, 3001)
}

async function handleUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = await adminApi.uploadImage(file, auth.token!)
  if (url) form.avatar_url = url
}

onMounted(async () => {
  await store.fetchProfile()
  if (store.profile) Object.assign(form, store.profile)
})
</script>

<style scoped>
.panel-header { margin-bottom: 1.5rem; }
.panel-header h2 { font-size: 1.25rem; font-weight: 600; }
.profile-form { max-width: 700px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0 1rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.field label { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
.field input, .field textarea {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.625rem 0.875rem;
  color: var(--text);
  font-size: 0.875rem;
  outline: none;
  transition: border-color var(--tr);
  resize: vertical;
}
.field input:focus, .field textarea:focus { border-color: rgba(232,213,183,0.4); }
.upload-row { display: flex; gap: 0.5rem; }
.upload-row input { flex: 1; }
.upload-btn {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.625rem 1rem;
  font-size: 0.8rem;
  color: var(--muted);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--tr);
}
.upload-btn:hover { border-color: var(--accent); color: var(--accent); }
.save-row { display: flex; align-items: center; gap: 1rem; }
.btn-primary {
  background: var(--accent);
  color: #0a0a0a;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--tr);
}
.btn-primary:hover:not(:disabled) { background: var(--accent2); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.save-msg { font-size: 0.8rem; color: var(--success); }
.save-msg.error { color: var(--danger); }
.empty-state { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.875rem; }
</style>
