import type { Translations } from '../types'

/**
 * English (US) translations
 */
export const enUS: Translations = {
  // Payment container
  'payment.methods.stablecoin': 'Stablecoin',
  'payment.methods.card': 'Credit Card',
  'payment.submit': 'Pay',

  // Crypto payment method
  'crypto.labels.network': 'Network',
  'crypto.labels.currency': 'Currency',
  'crypto.options.tron': 'Tron',
  'crypto.options.usdt': 'USDT',
  'crypto.validation.networkRequired': 'Please select a network',
  'crypto.validation.currencyRequired': 'Please select a currency',

  // Credit card payment method
  'card.labels.cardNumber': 'Card Number',
  'card.labels.cardHolder': 'Card Holder',
  'card.labels.expiry': 'Expiry',
  'card.labels.cvv': 'CVV',
  'card.placeholders.cardNumber': 'xxxx xxxx xxxx xxxx',
  'card.placeholders.cardHolder': 'Name on Card',
  'card.placeholders.expiry': 'MM/YY',
  'card.placeholders.cvv': 'xxx',
  'card.placeholders.cvvAmex': 'xxxx',
  'card.validation.invalidCardNumber': 'Please enter a valid card number',
  'card.validation.holderRequired': 'Please enter card holder name',
  'card.validation.invalidExpiry': 'Please enter a valid expiry date (MM/YY)',
  'card.validation.invalidCvv': 'Please enter a valid CVV',

  // UI components
  'ui.select.placeholder': 'Please select'
}
