import { createContext } from '@lit/context'

import type { SupportedLocale, Translations } from '@src/i18n/types'

/**
 * Global context
 */
export interface Context {
  locale: SupportedLocale
  translations?: Partial<Translations>
  t: (key: string) => string
}

/**
 * Context key for sharing state across components
 */
export const AppContext = createContext<Context>(Symbol('upos-context'))
