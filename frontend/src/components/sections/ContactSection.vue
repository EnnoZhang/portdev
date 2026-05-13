<template>
  <section class="section contact" id="contact">
    <div class="container">
      <div class="contact-grid">
        <!-- Info -->
        <div class="contact-info" v-reveal>
          <div class="section-label">{{ t('contact.label') }}</div>
          <h2 class="section-title">{{ t('contact.title') }}</h2>
          <p>{{ t('contact.subtitle') }}</p>
          <div class="contact-links">
            <a v-if="profile?.email" :href="`mailto:${profile.email}`" class="contact-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {{ profile.email }}
            </a>
            <a v-if="profile?.phone" :href="`tel:${profile.phone}`" class="contact-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              {{ profile.phone }}
            </a>
            <a v-if="profile?.github_url" :href="profile.github_url" target="_blank" rel="noopener noreferrer" class="contact-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <!-- Form -->
        <form class="contact-form" @submit.prevent="handleSubmit" novalidate v-reveal="1">
          <div class="form-group">
            <label for="cf-name">{{ t('contact.form.name') }}</label>
            <input
              id="cf-name"
              v-model="form.name"
              type="text"
              :placeholder="t('contact.form.namePlaceholder')"
              :class="{ error: errors.name }"
              @input="errors.name = ''"
            />
            <span class="form-error">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label for="cf-email">{{ t('contact.form.email') }}</label>
            <input
              id="cf-email"
              v-model="form.email"
              type="email"
              :placeholder="t('contact.form.emailPlaceholder')"
              :class="{ error: errors.email }"
              @input="errors.email = ''"
            />
            <span class="form-error">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label for="cf-subject">{{ t('contact.form.subject') }}</label>
            <input
              id="cf-subject"
              v-model="form.subject"
              type="text"
              :placeholder="t('contact.form.subjectPlaceholder')"
            />
          </div>
          <div class="form-group">
            <label for="cf-message">{{ t('contact.form.message') }}</label>
            <textarea
              id="cf-message"
              v-model="form.message"
              rows="5"
              :placeholder="t('contact.form.messagePlaceholder')"
              :class="{ error: errors.message }"
              @input="errors.message = ''"
            />
            <span class="form-error">{{ errors.message }}</span>
          </div>
          <button type="submit" class="btn btn-primary btn-full" :disabled="submitting">
            <span>{{ submitting ? t('contact.form.submitting') : t('contact.form.submit') }}</span>
            <svg v-if="!submitting" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
          <Transition name="fade">
            <div v-if="successMsg" class="form-success">{{ successMsg }}</div>
          </Transition>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { api } from '@/api'
import { vReveal } from '@/directives/reveal'
import type { ContactFormErrors } from '@/types'

const { t } = useI18n()
const store = usePortfolioStore()
const profile = computed(() => store.profile)

const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive<ContactFormErrors>({ name: '', email: '', message: '' })
const submitting = ref(false)
const successMsg = ref('')

function validate(): boolean {
  let ok = true
  if (!form.name.trim()) { errors.name = t('contact.errors.nameRequired'); ok = false }
  if (!form.email.trim()) { errors.email = t('contact.errors.emailRequired'); ok = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errors.email = t('contact.errors.emailInvalid'); ok = false }
  if (!form.message.trim()) { errors.message = t('contact.errors.messageRequired'); ok = false }
  return ok
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  try {
    const result = await api.submitContact({ ...form })
    if (result.success) {
      Object.assign(form, { name: '', email: '', subject: '', message: '' })
      successMsg.value = t('contact.form.success')
      setTimeout(() => { successMsg.value = '' }, 5000)
    } else if (result.errors) {
      if (result.errors.name) errors.name = result.errors.name
      if (result.errors.email) errors.email = result.errors.email
      if (result.errors.message) errors.message = result.errors.message
    } else {
      successMsg.value = result.message || t('contact.form.networkError')
    }
  } catch {
    successMsg.value = t('contact.form.networkError')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact { background: var(--color-bg-2); }
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 6rem;
  align-items: start;
}
.contact-info p { color: var(--color-text-muted); margin-bottom: 2rem; }
.contact-links { display: flex; flex-direction: column; gap: 1rem; }
.contact-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  transition: color var(--transition);
}
.contact-link svg { width: 18px; height: 18px; flex-shrink: 0; color: var(--color-accent); }
.contact-link:hover { color: var(--color-accent); }

.contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.8rem; font-weight: 500; color: var(--color-text-muted); }
.form-group input, .form-group textarea {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0.875rem 1.125rem;
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  transition: border-color var(--transition);
  resize: none;
  outline: none;
}
.form-group input::placeholder, .form-group textarea::placeholder {
  color: rgba(136,136,136,0.5);
}
.form-group input:focus, .form-group textarea:focus {
  border-color: rgba(232,213,183,0.4);
}
.form-group input.error, .form-group textarea.error { border-color: #e05252; }
.form-error { font-size: 0.75rem; color: #e05252; min-height: 1rem; }
.btn-full { width: 100%; justify-content: center; }
.btn-full svg { width: 16px; height: 16px; }
.btn-full:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }
.form-success {
  text-align: center;
  padding: 1rem;
  background: rgba(67,233,123,0.1);
  border: 1px solid rgba(67,233,123,0.2);
  border-radius: var(--radius);
  color: #43e97b;
  font-size: 0.875rem;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
}
</style>
