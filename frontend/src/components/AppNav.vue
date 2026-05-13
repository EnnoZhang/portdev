<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-container">
      <a href="#hero" class="nav-logo">{{ initials }}.</a>

      <ul class="nav-links" :class="{ open: menuOpen }">
        <li v-for="item in navItems" :key="item.key">
          <a :href="`#${item.key}`" @click="closeMenu">{{ t(`nav.${item.key}`) }}</a>
        </li>
      </ul>

      <div class="nav-right">
        <!-- Language switcher -->
        <div class="lang-switcher">
          <button
            v-for="loc in locales"
            :key="loc.code"
            class="lang-btn"
            :class="{ active: currentLocale === loc.code }"
            @click="switchLocale(loc.code)"
            :aria-label="`Switch to ${loc.label}`"
          >
            {{ loc.label }}
          </button>
        </div>

        <!-- Mobile toggle -->
        <button
          class="nav-toggle"
          :class="{ open: menuOpen }"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import type { Locale } from '@/types'

const { t, locale } = useI18n()
const store = usePortfolioStore()

const isScrolled = ref(false)
const menuOpen = ref(false)
const currentLocale = computed(() => locale.value as Locale)

const navItems = [
  { key: 'about' },
  { key: 'skills' },
  { key: 'works' },
  { key: 'contact' },
]

const locales: { code: Locale; label: string }[] = [
  { code: 'zh', label: '中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JP' },
]

const initials = computed(() => {
  const name = store.profile?.name || 'YN'
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
})

function switchLocale(loc: Locale) {
  setLocale(loc)
  menuOpen.value = false
}

function closeMenu() {
  menuOpen.value = false
}

function handleScroll() {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: all var(--transition);
}
.navbar.scrolled {
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}
.nav-container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
  letter-spacing: -0.02em;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
.nav-links a {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  transition: color var(--transition);
  position: relative;
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0;
  width: 0; height: 1px;
  background: var(--color-accent);
  transition: width var(--transition);
}
.nav-links a:hover { color: var(--color-text); }
.nav-links a:hover::after { width: 100%; }

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Language switcher */
.lang-switcher {
  display: flex;
  gap: 0.25rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--color-border);
  border-radius: 50px;
  padding: 0.2rem;
}
.lang-btn {
  padding: 0.25rem 0.625rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  transition: all var(--transition);
}
.lang-btn.active {
  background: var(--color-accent);
  color: #0a0a0a;
}
.lang-btn:hover:not(.active) { color: var(--color-text); }

/* Mobile toggle */
.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}
.nav-toggle span {
  display: block;
  width: 24px; height: 1.5px;
  background: var(--color-text);
  transition: all var(--transition);
}
.nav-toggle.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.nav-toggle.open span:nth-child(2) { opacity: 0; }
.nav-toggle.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(10, 10, 10, 0.97);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    z-index: 999;
  }
  .nav-links.open { display: flex; }
  .nav-links a { font-size: 1.5rem; color: var(--color-text); }
  .nav-toggle { display: flex; z-index: 1000; }
}
</style>
