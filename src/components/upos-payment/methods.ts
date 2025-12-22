import type { PaymentMethodType } from '@src/types'

/**
 * Payment method configuration
 */
export interface PaymentMethodConfig {
  readonly method: PaymentMethodType
  readonly tag: string
  readonly nameKey: string
  readonly slotName: string
  readonly formPart: string
  readonly slots: readonly string[]
}

/**
 * Payment methods configuration
 * Add new payment methods here to automatically integrate them into the system
 */
export const list: readonly PaymentMethodConfig[] = [
  {
    method: 'crypto_tron' as const,
    tag: 'crypto-tron',
    nameKey: 'payment.methods.stablecoin',
    slotName: 'option-crypto',
    formPart: 'payment-form-crypto',
    slots: ['network-select', 'currency-select']
  }
  // {
  //   method: 'credit_card' as const,
  //   tag: 'credit-card',
  //   nameKey: 'payment.methods.card',
  //   slotName: 'option-card',
  //   formPart: 'payment-form-card',
  //   slots: ['card-number-input', 'card-holder-input', 'expiry-input', 'cvv-input']
  // }
] as const

export function find(method: PaymentMethodType): PaymentMethodConfig | undefined {
  return list.find((m) => m.method === method)
}
