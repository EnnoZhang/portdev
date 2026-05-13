<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <a href="#hero" class="footer-logo">{{ initials }}.</a>
        <p>© {{ year }} {{ profile?.name || 'Your Name' }}. {{ t('footer.tagline') }}</p>
        <div class="footer-links">
          <a href="#about">{{ t('footer.links.about') }}</a>
          <a href="#works">{{ t('footer.links.works') }}</a>
          <a href="#contact">{{ t('footer.links.contact') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'

const { t } = useI18n()
const store = usePortfolioStore()
const profile = computed(() => store.profile)
const year = new Date().getFullYear()
const initials = computed(() => {
  const name = profile.value?.name || 'YN'
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
})
</script>

<style scoped>
.footer {
  padding: 2.5rem 0;
  border-top: 1px solid var(--color-border);
}
.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.footer-logo {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
}
.footer-content p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
.footer-links { display: flex; gap: 1.5rem; }
.footer-links a {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  transition: color var(--transition);
}
.footer-links a:hover { color: var(--color-accent); }
</style>
