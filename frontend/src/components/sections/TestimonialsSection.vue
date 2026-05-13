<template>
  <section class="section testimonials">
    <div class="container">
      <div class="section-header" v-reveal>
        <div class="section-label">{{ t('testimonials.label') }}</div>
        <h2 class="section-title">{{ t('testimonials.title') }}</h2>
      </div>

      <div class="testimonials-slider" v-reveal>
        <Transition name="slide" mode="out-in">
          <div class="testimonial-card" :key="current">
            <div class="testimonial-quote">"</div>
            <p>{{ items[current].text }}</p>
            <div class="testimonial-author">
              <div class="author-avatar">{{ initials(items[current].name) }}</div>
              <div>
                <strong>{{ items[current].name }}</strong>
                <span>{{ items[current].role }}</span>
              </div>
            </div>
          </div>
        </Transition>

        <div class="slider-controls">
          <button class="slider-btn" @click="prev" :aria-label="t('testimonials.prev')">←</button>
          <div class="slider-dots">
            <button
              v-for="(_, i) in items"
              :key="i"
              class="dot"
              :class="{ active: i === current }"
              @click="goTo(i)"
              :aria-label="`Testimonial ${i + 1}`"
            />
          </div>
          <button class="slider-btn" @click="next" :aria-label="t('testimonials.next')">→</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { vReveal } from '@/directives/reveal'

const { t, tm } = useI18n()
const current = ref(0)
let timer: ReturnType<typeof setInterval>

const items = computed(() => tm('testimonials.items') as { text: string; name: string; role: string }[])

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
function goTo(i: number) {
  current.value = (i + items.value.length) % items.value.length
  resetTimer()
}
function prev() { goTo(current.value - 1) }
function next() { goTo(current.value + 1) }
function resetTimer() {
  clearInterval(timer)
  timer = setInterval(next, 5000)
}

onMounted(() => resetTimer())
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.testimonials-slider { max-width: 700px; margin: 0 auto; }
.testimonial-card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 3rem;
  text-align: center;
}
.testimonial-quote {
  font-family: var(--font-serif);
  font-size: 5rem;
  line-height: 0.5;
  color: var(--color-accent);
  opacity: 0.4;
  margin-bottom: 1.5rem;
}
.testimonial-card p {
  font-size: 1.05rem;
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 2rem;
  font-style: italic;
}
.testimonial-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
.author-avatar {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0a0a0a;
  flex-shrink: 0;
}
.testimonial-author strong { display: block; font-size: 0.95rem; text-align: left; }
.testimonial-author span { font-size: 0.8rem; color: var(--color-text-muted); }
.slider-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}
.slider-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 1rem;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}
.slider-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
.slider-dots { display: flex; gap: 0.5rem; }
.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-border);
  transition: all var(--transition);
  cursor: pointer;
}
.dot.active { background: var(--color-accent); width: 20px; border-radius: 3px; }

/* Transition */
.slide-enter-active, .slide-leave-active { transition: all 0.35s ease; }
.slide-enter-from { opacity: 0; transform: translateX(30px); }
.slide-leave-to   { opacity: 0; transform: translateX(-30px); }

@media (max-width: 480px) {
  .testimonial-card { padding: 2rem 1.5rem; }
}
</style>
