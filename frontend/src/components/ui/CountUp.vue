<template>
  <span ref="el">{{ display }}{{ suffix }}</span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{ target: number; suffix?: string }>()

const el = ref<HTMLElement | null>(null)
const display = ref(0)
let started = false

function animate() {
  if (started) return
  started = true
  const duration = 1500
  const start = performance.now()
  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    display.value = Math.floor(eased * props.target)
    if (progress < 1) requestAnimationFrame(tick)
    else display.value = props.target
  }
  requestAnimationFrame(tick)
}

useIntersectionObserver(el, ([entry]) => {
  if (entry.isIntersecting) animate()
}, { threshold: 0.5 })

watch(() => props.target, () => { started = false; display.value = 0 })
onMounted(() => { display.value = 0 })
</script>

<style scoped>
span {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
  display: block;
}
</style>
