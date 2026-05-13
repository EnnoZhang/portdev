import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'
import ja from './locales/ja'
import type { Locale } from '@/types'

const LOCALE_KEY = 'portfolio_locale'

function getDefaultLocale(): Locale {
  const saved = localStorage.getItem(LOCALE_KEY) as Locale | null
  if (saved && ['zh', 'en', 'ja'].includes(saved)) return saved

  const browser = navigator.language.toLowerCase()
  if (browser.startsWith('zh')) return 'zh'
  if (browser.startsWith('ja')) return 'ja'
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'en',
  messages: { zh, en, ja },
})

export function setLocale(locale: Locale) {
  ;(i18n.global.locale as { value: Locale }).value = locale
  localStorage.setItem(LOCALE_KEY, locale)
  document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale
}

export type MessageSchema = typeof zh
