<template>
  <section class="section works" id="works">
    <div class="container">
      <div class="section-header" v-reveal>
        <div class="section-label">{{ t('works.label') }}</div>
        <h2 class="section-title">{{ t('works.title') }}</h2>
      </div>

      <!-- Filter buttons -->
      <div class="works-filter">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="filter-btn"
          :class="{ active: activeCategory === cat.value }"
          @click="store.setCategory(cat.value)"
        >
          {{ t(cat.labelKey) }}
        </button>
      </div>

      <!-- Project grid -->
      <TransitionGroup name="works" tag="div" class="works-grid">
        <div
          v-for="(project, i) in filteredProjects"
          :key="project.id"
          class="work-card"
          v-reveal="i % 3"
        >
          <div
            class="work-image"
            :style="project.image_url ? {} : { background: gradients[i % gradients.length] }"
          >
            <img
              v-if="project.image_url"
              :src="project.image_url"
              :alt="project.title"
              loading="lazy"
            />
            <div class="work-overlay">
              <a
                :href="project.project_url || '#'"
                class="work-link"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('works.viewProject')"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
            <span class="work-number">{{ String(i + 1).padStart(2, '0') }}</span>
          </div>
          <div class="work-info">
            <span class="work-category">{{ t(`works.categories.${project.category}`) }}</span>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import { vReveal } from '@/directives/reveal'
import type { ProjectCategory } from '@/types'

const { t } = useI18n()
const store = usePortfolioStore()
const activeCategory = computed(() => store.activeCategory)
const filteredProjects = computed(() => store.filteredProjects())

const categories: { value: ProjectCategory; labelKey: string }[] = [
  { value: 'all',    labelKey: 'works.filterAll' },
  { value: 'design', labelKey: 'works.filterDesign' },
  { value: 'dev',    labelKey: 'works.filterDev' },
  { value: 'brand',  labelKey: 'works.filterBrand' },
]

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
]
</script>

<style scoped>
.works { background: var(--color-bg-2); }
.works-filter {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  transition: all var(--transition);
}
.filter-btn:hover, .filter-btn.active {
  background: var(--color-accent);
  color: #0a0a0a;
  border-color: var(--color-accent);
}
.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.work-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  transition: all var(--transition);
}
.work-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow);
  border-color: rgba(232,213,183,0.15);
}
.work-image {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}
.work-image img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.work-number {
  position: absolute;
  top: 1rem; left: 1.25rem;
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: rgba(255,255,255,0.15);
  line-height: 1;
  transition: color var(--transition);
}
.work-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition);
}
.work-card:hover .work-overlay { opacity: 1; }
.work-card:hover .work-number { color: rgba(255,255,255,0.4); }
.work-link {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0a0a0a;
  transform: scale(0.8);
  transition: transform var(--transition);
}
.work-card:hover .work-link { transform: scale(1); }
.work-link svg { width: 18px; height: 18px; }
.work-info { padding: 1.5rem; }
.work-category {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent-2);
  display: block;
  margin-bottom: 0.5rem;
}
.work-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.work-info p {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* TransitionGroup */
.works-enter-active, .works-leave-active { transition: all 0.4s ease; }
.works-enter-from { opacity: 0; transform: translateY(20px); }
.works-leave-to   { opacity: 0; transform: scale(0.95); }
.works-leave-active { position: absolute; }

@media (max-width: 1024px) { .works-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px)  { .works-grid { grid-template-columns: 1fr; } }
</style>
