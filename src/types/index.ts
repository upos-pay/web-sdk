export type PaymentMethodType = 'credit_card' | 'crypto_tron'

export type PaymentData
  = { method: 'credit_card', data: CreditCardData }
  | { method: 'crypto_tron', data: CryptoTronData }

export interface CryptoTronData {
  network: 'tron'
  currency: 'usdt'
}

export interface CreditCardData {
  cardNumber: string
  cardHolder: string
  expiry: string
  cvv: string
}

export interface PrepareResult {
  token: string
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export interface PaymentConfig {
  publicKey?: string
  host?: string
}

export type PrepareCallback = (data: PaymentData) => Promise<PrepareResult>

export type { Translations, SupportedLocale } from '../i18n/types'
