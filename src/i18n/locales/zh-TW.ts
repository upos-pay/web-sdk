import type { Translations } from '../types'

/**
 * Traditional Chinese (Taiwan) translations
 */
export const zhTW: Translations = {
  // Payment container
  'payment.methods.stablecoin': '穩定幣',
  'payment.methods.card': '信用卡',
  'payment.submit': '付款',

  // Crypto payment method
  'crypto.labels.network': '網路',
  'crypto.labels.currency': '幣種',
  'crypto.options.tron': 'Tron',
  'crypto.options.usdt': 'USDT',
  'crypto.validation.networkRequired': '請選擇網路',
  'crypto.validation.currencyRequired': '請選擇幣種',

  // Credit card payment method
  'card.labels.cardNumber': '卡號',
  'card.labels.cardHolder': '持卡人',
  'card.labels.expiry': '有效期',
  'card.labels.cvv': '安全碼',
  'card.placeholders.cardNumber': 'xxxx xxxx xxxx xxxx',
  'card.placeholders.cardHolder': '持卡人姓名',
  'card.placeholders.expiry': 'MM/YY',
  'card.placeholders.cvv': 'xxx',
  'card.placeholders.cvvAmex': 'xxxx',
  'card.validation.invalidCardNumber': '請輸入有效的卡號',
  'card.validation.holderRequired': '請輸入持卡人姓名',
  'card.validation.invalidExpiry': '請輸入有效的有效期 (MM/YY)',
  'card.validation.invalidCvv': '請輸入有效的安全碼',

  // UI components
  'ui.select.placeholder': '請選擇'
}
