<template>
  <section class="section skills" id="skills">
    <div class="container">
      <div class="section-header" v-reveal>
        <div class="section-label">{{ t('skills.label') }}</div>
        <h2 class="section-title">{{ t('skills.title') }}</h2>
      </div>
      <div class="skills-grid">
        <div
          v-for="(skill, i) in skills"
          :key="skill.id"
          class="skill-card"
          v-reveal="i"
        >
          <div class="skill-icon" v-html="icons[skill.icon] || icons.code" />
          <h3>{{ skill.title }}</h3>
          <p>{{ skill.description }}</p>
          <div class="skill-tags">
            <span v-for="tag in skill.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { vReveal } from '@/directives/reveal'
import type { SkillIcon } from '@/types'

const { t } = useI18n()
const store = usePortfolioStore()
const skills = computed(() => store.skills)

const icons: Record<SkillIcon, string> = {
  layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
}
</script>

<style scoped>
.skills-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.skill-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}
.skill-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-2));
  transform: scaleX(0);
  transition: transform var(--transition);
}
.skill-card:hover {
  border-color: rgba(232,213,183,0.2);
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}
.skill-card:hover::before { transform: scaleX(1); }
.skill-icon {
  width: 48px; height: 48px;
  color: var(--color-accent);
  margin-bottom: 1.25rem;
}
.skill-icon :deep(svg) { width: 100%; height: 100%; }
.skill-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.skill-card p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}
.skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-tags span {
  font-size: 0.7rem;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  background: rgba(232,213,183,0.08);
  color: var(--color-accent);
  border: 1px solid rgba(232,213,183,0.15);
}
@media (max-width: 1024px) { .skills-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .skills-grid { grid-template-columns: 1fr; } }
</style>
