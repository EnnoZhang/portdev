<template>
  <div>
    <div class="panel-header">
      <h2>作品管理</h2>
      <button class="btn-primary" @click="openModal()">+ 新增作品</button>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!store.projects.length" class="empty-state">暂无作品，点击右上角新增</div>
    <div v-else>
      <div v-for="p in store.projects" :key="p.id" class="item-card">
        <div class="item-info">
          <h4>{{ p.title }}</h4>
          <p>{{ p.description }}</p>
        </div>
        <span class="item-badge">{{ catLabel(p.category) }}</span>
        <div class="item-actions">
          <button class="btn-ghost" @click="openModal(p)">编辑</button>
          <button class="btn-danger" @click="deleteItem(p.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editing ? '编辑作品' : '新增作品' }}</h3>
            <button @click="showModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="field"><label>标题 *</label><input v-model="form.title" type="text" /></div>
            <div class="field">
              <label>分类 *</label>
              <select v-model="form.category">
                <option value="design">UI/UX 设计</option>
                <option value="dev">开发</option>
                <option value="brand">品牌</option>
              </select>
            </div>
            <div class="field"><label>描述 *</label><textarea v-model="form.description" rows="3" /></div>
            <div class="field"><label>标签（逗号分隔）</label><input v-model="tagsInput" type="text" /></div>
            <div class="field"><label>项目链接</label><input v-model="form.project_url" type="url" /></div>
            <div class="field">
              <label>图片</label>
              <div class="upload-row">
                <input v-model="form.image_url" type="text" placeholder="https://..." />
                <label class="upload-btn">
                  上传
                  <input type="file" accept="image/*" style="display:none" @change="handleUpload" />
                </label>
              </div>
            </div>
            <div class="field"><label>排序</label><input v-model.number="form.sort_order" type="number" /></div>
            <button class="btn-primary" @click="save" :disabled="saving">{{ saving ? '保存中...' : '保存' }}</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useAuthStore } from '../../stores/auth'
import { adminApi } from '@/api'
import type { Project } from '@/types'

const store = useAdminStore()
const auth = useAuthStore()
const loading = ref(false)
const showModal = ref(false)
const saving = ref(false)
const editing = ref<number | null>(null)
const tagsInput = ref('')

const form = reactive<Partial<Project>>({
  title: '', category: 'design', description: '',
  project_url: '', image_url: '', sort_order: 0,
})

function catLabel(cat: string) {
  return { design: 'UI/UX 设计', dev: '开发', brand: '品牌' }[cat] || cat
}

function openModal(p?: Project) {
  editing.value = p?.id ?? null
  Object.assign(form, p ?? { title: '', category: 'design', description: '', project_url: '', image_url: '', sort_order: 0 })
  tagsInput.value = (p?.tags ?? []).join(', ')
  showModal.value = true
}

async function save() {
  if (!form.title || !form.description) return alert('标题和描述为必填项')
  saving.value = true
  const data = { ...form, tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) }
  const res = editing.value
    ? await adminApi.updateProject(editing.value, data, auth.token!)
    : await adminApi.createProject(data, auth.token!)
  saving.value = false
  if (res.success) { showModal.value = false; await store.fetchProjects() }
  else alert(res.message || '保存失败')
}

async function deleteItem(id: number) {
  if (!confirm('确认删除这个作品？')) return
  await adminApi.deleteProject(id, auth.token!)
  await store.fetchProjects()
}

async function handleUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const url = await adminApi.uploadImage(file, auth.token!)
  if (url) form.image_url = url
}

onMounted(async () => {
  loading.value = true
  await store.fetchProjects()
  loading.value = false
})
</script>

<style scoped>
.panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.panel-header h2 { font-size: 1.25rem; font-weight: 600; }
.empty-state { text-align: center; padding: 3rem; color: var(--muted); font-size: 0.875rem; }
.item-card {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.item-card:hover { border-color: rgba(232,213,183,0.15); }
.item-info { flex: 1; min-width: 0; }
.item-info h4 { font-size: 0.95rem; font-weight: 500; margin-bottom: 0.25rem; }
.item-info p { font-size: 0.8rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  background: rgba(232,213,183,0.1);
  color: var(--accent);
  border: 1px solid rgba(232,213,183,0.15);
  flex-shrink: 0;
}
.item-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }
.btn-primary {
  background: var(--accent);
  color: #0a0a0a;
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--tr);
}
.btn-primary:hover:not(:disabled) { background: var(--accent2); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
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

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.modal {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}
.modal-header h3 { font-size: 1rem; font-weight: 600; }
.modal-header button { color: var(--muted); font-size: 1rem; transition: color var(--tr); }
.modal-header button:hover { color: var(--text); }
.modal-body { padding: 1.5rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
.field label { font-size: 0.8rem; color: var(--muted); font-weight: 500; }
.field input, .field textarea, .field select {
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
.field input:focus, .field textarea:focus, .field select:focus { border-color: rgba(232,213,183,0.4); }
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
.modal-body .btn-primary { width: 100%; justify-content: center; margin-top: 0.5rem; }
</style>
