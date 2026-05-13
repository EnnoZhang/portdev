<template>
  <div class="portfolio">
    <AppNav />
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <WorksSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'
import AppNav from '@/components/AppNav.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import SkillsSection from '@/components/sections/SkillsSection.vue'
import WorksSection from '@/components/sections/WorksSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import AppFooter from '@/components/AppFooter.vue'

const store = usePortfolioStore()
onMounted(() => store.fetchAll())
</script>
