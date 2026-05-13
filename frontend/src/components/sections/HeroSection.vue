<template>
  <section class="hero" id="hero">
    <div class="hero-bg" />
    <div class="hero-content">
      <p class="hero-greeting">{{ t('hero.greeting') }}</p>
      <h1 class="hero-name">{{ profile?.name || 'Your Name' }}</h1>
      <p class="hero-tagline">{{ profile?.tagline || t('hero.greeting') }}</p>
      <p class="hero-desc">{{ profile?.bio || '' }}</p>
      <div class="hero-actions">
        <a href="#works" class="btn btn-primary">{{ t('hero.viewWorks') }}</a>
        <a href="#contact" class="btn btn-outline">{{ t('hero.contactMe') }}</a>
      </div>
    </div>
    <div class="hero-scroll">
      <span>{{ t('hero.scrollDown') }}</span>
      <div class="scroll-line" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'

const { t } = useI18n()
const store = usePortfolioStore()
const profile = computed(() => store.profile)
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(232,213,183,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 80% 80%, rgba(201,169,110,0.04) 0%, transparent 50%);
}
.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}
.hero-content {
  position: relative;
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  animation: fadeInUp 1s ease both;
}
.hero-greeting {
  font-size: 1rem;
  color: var(--color-text-muted);
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}
.hero-name {
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 10vw, 7rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}
.hero-tagline {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--color-accent);
  font-weight: 300;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}
.hero-desc {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 2.5rem;
}
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.hero-scroll {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  animation: fadeIn 1.5s ease 0.5s both;
}
.scroll-line {
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, var(--color-text-muted), transparent);
  animation: scrollPulse 2s ease infinite;
}
@media (max-width: 480px) {
  .hero-actions { flex-direction: column; align-items: center; }
}
</style>
