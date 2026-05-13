import type { Directive } from 'vue'

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
)

export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value !== undefined) {
      el.style.transitionDelay = `${binding.value * 0.1}s`
    }
    observer.observe(el)
  },
  unmounted(el) {
    observer.unobserve(el)
  },
}
