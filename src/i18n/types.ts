/**
 * Supported locales
 */
export type SupportedLocale = 'en-US' | 'zh-TW'

/**
 * Flat translation structure using dot notation keys
 * Example: { 'payment.submit': 'Pay', 'card.labels.cardNumber': 'Card Number' }
 */
export type Translations = Record<string, string>
