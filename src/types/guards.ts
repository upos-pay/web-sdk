import type {
  CreditCardData,
  CryptoTronData,
  PaymentData
} from './index'

/**
 * Type guard for credit card payment.
 */
export function isCreditCardPayment(
  data: PaymentData
): data is { method: 'credit_card', data: CreditCardData } {
  return data.method === 'credit_card'
}

/**
 * Type guard for crypto (Tron) payment.
 */
export function isCryptoTronPayment(
  data: PaymentData
): data is { method: 'crypto_tron', data: CryptoTronData } {
  return data.method === 'crypto_tron'
}
