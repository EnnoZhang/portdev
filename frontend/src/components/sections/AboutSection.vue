<template>
  <section class="section about" id="about">
    <div class="container">
      <div class="about-grid" v-reveal>
        <div class="about-image">
          <div class="image-frame">
            <img
              v-if="profile?.avatar_url"
              :src="profile.avatar_url"
              :alt="profile.name"
            />
            <div class="image-placeholder">
              <span>{{ initials }}</span>
            </div>
          </div>
          <div class="about-stats">
            <div class="stat" v-for="stat in stats" :key="stat.key">
              <CountUp class="stat-number" :target="stat.value" suffix="+" />
              <span class="stat-label">{{ t(`about.${stat.key}`) }}</span>
            </div>
          </div>
        </div>

        <div class="about-text">
          <div class="section-label">{{ t('about.label') }}</div>
          <h2 class="section-title">{{ t('about.title') }}</h2>
          <p v-if="profile?.bio_detail">{{ profile.bio_detail }}</p>
          <p v-else>{{ profile?.bio }}</p>
          <a href="#contact" class="btn btn-primary">{{ t('about.learnMore') }}</a>
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
import CountUp from '@/components/ui/CountUp.vue'

const { t } = useI18n()
const store = usePortfolioStore()
const profile = computed(() => store.profile)

const initials = computed(() => {
  const name = profile.value?.name || 'YN'
  return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
})

const stats = computed(() => [
  { key: 'yearsExp', value: profile.value?.years_exp ?? 5 },
  { key: 'projects', value: profile.value?.projects_count ?? 30 },
  { key: 'clients', value: profile.value?.clients_count ?? 20 },
])
</script>

<style scoped>
.about { background: var(--color-bg-2); }
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
}
.image-frame {
  position: relative;
  aspect-ratio: 4/5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-3);
}
.image-frame img {
  width: 100%; height: 100%;
  object-fit: cover;
  position: relative;
  z-index: 1;
}
.image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 4rem;
  font-weight: 700;
  color: var(--color-accent);
  background: linear-gradient(135deg, var(--color-bg-3), var(--color-bg));
}
.about-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}
.stat {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.25rem 1rem;
  text-align: center;
}
.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  display: block;
  margin-top: 0.25rem;
}
.about-text p {
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
}
.about-text .btn { margin-top: 0.5rem; }

@media (max-width: 1024px) {
  .about-grid { gap: 3rem; }
}
@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; }
  .about-image { max-width: 400px; margin: 0 auto; }
}
</style>
