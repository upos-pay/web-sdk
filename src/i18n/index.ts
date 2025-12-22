import type { Translations, SupportedLocale } from './types'

import { enUS } from './locales/en-US'
import { zhTW } from './locales/zh-TW'

export type { Translations, SupportedLocale }

export const Locales = {
  'en-US': enUS,
  'zh-TW': zhTW
}

export type TranslationParams = Record<string, string>

export type TranslationFunction = (key: string, params?: TranslationParams) => string

/**
 * Create a translation function with fallback chain: custom -> locale -> en-US -> ''
 * Supports interpolation with {{param}} syntax
 */
export function createTranslation(locale: SupportedLocale, translations?: Partial<Translations>): TranslationFunction {
  return (key: string, params?: TranslationParams) => {
    const template = translations?.[key] ?? Locales[locale]?.[key] ?? Locales['en-US']?.[key] ?? ''
    if (!params) { return template }
    return template.replace(/\{\{(\w+)\}\}/g, (_, name) => params[name] ?? '')
  }
}
