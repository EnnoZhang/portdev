<template>
  <div>
    <div class="panel-header">
      <h2>技能管理</h2>
      <button class="btn-primary" @click="openModal()">+ 新增技能</button>
    </div>

    <div v-if="loading" class="empty-state">加载中...</div>
    <div v-else-if="!store.skills.length" class="empty-state">暂无技能，点击右上角新增</div>
    <div v-else>
      <div v-for="s in store.skills" :key="s.id" class="item-card">
        <div class="item-info">
          <h4>{{ s.title }}</h4>
          <p>{{ s.description }}</p>
        </div>
        <div class="item-tags">
          <span v-for="tag in s.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div class="item-actions">
          <button class="btn-ghost" @click="openModal(s)">编辑</button>
          <button class="btn-danger" @click="deleteItem(s.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ editing ? '编辑技能' : '新增技能' }}</h3>
            <button @click="showModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="field"><label>标题 *</label><input v-model="form.title" type="text" /></div>
            <div class="field"><label>描述</label><textarea v-model="form.description" rows="3" /></div>
            <div class="field">
              <label>图标</label>
              <select v-model="form.icon">
                <option value="layers">图层（设计）</option>
                <option value="code">代码（开发）</option>
                <option value="monitor">屏幕（后端）</option>
                <option value="shield">盾牌（品牌）</option>
              </select>
            </div>
            <div class="field"><label>标签（逗号分隔）</label><input v-model="tagsInput" type="text" placeholder="React, Vue, TypeScript" /></div>
            <div class="field"><label>排序（数字越小越靠前）</label><input v-model.number="form.sort_order" type="number" /></div>
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
import type { Skill, SkillIcon } from '@/types'

const store = useAdminStore()
const auth = useAuthStore()
const loading = ref(false)
const showModal = ref(false)
const saving = ref(false)
const editing = ref<number | null>(null)
const tagsInput = ref('')

const form = reactive<Partial<Skill>>({
  title: '',
  description: '',
  icon: 'code' as SkillIcon,
  sort_order: 0,
})

function openModal(s?: Skill) {
  editing.value = s?.id ?? null
  Object.assign(form, s ?? { title: '', description: '', icon: 'code', sort_order: 0 })
  tagsInput.value = (s?.tags ?? []).join(', ')
  showModal.value = true
}

async function save() {
  if (!form.title?.trim()) {
    window.alert('标题为必填项')
    return
  }
  saving.value = true
  const data = {
    ...form,
    tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean),
  }
  const res = editing.value
    ? await adminApi.updateSkill(editing.value, data, auth.token!)
    : await adminApi.createSkill(data, auth.token!)
  saving.value = false
  if (res.success) {
    showModal.value = false
    await store.fetchSkills()
  } else {
    window.alert(res.message || '保存失败')
  }
}

async function deleteItem(id: number) {
  if (!window.confirm('确认删除这个技能？')) return
  await adminApi.deleteSkill(id, auth.token!)
  await store.fetchSkills()
}

onMounted(async () => {
  loading.value = true
  await store.fetchSkills()
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
.item-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; flex-shrink: 0; }
.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  background: rgba(232,213,183,0.08);
  color: var(--accent);
  border: 1px solid rgba(232,213,183,0.15);
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
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 1rem;
}
.modal {
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%; max-width: 480px;
  max-height: 90vh; overflow-y: auto;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
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
.modal-body .btn-primary { width: 100%; justify-content: center; margin-top: 0.5rem; }
</style>
