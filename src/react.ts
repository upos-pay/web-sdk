/**
 * React wrappers for UPOS Web Components
 * @module @upos-pay/web-sdk/react
 */

import { createComponent } from '@lit/react'
import React from 'react'

import { CreditCard as CreditCardElement } from './components/payment-methods/credit-card'
import { CryptoTron as CryptoTronElement } from './components/payment-methods/crypto-tron'
import { UposButton as UposButtonElement } from './components/ui/upos-button'
import { UposInput as UposInputElement } from './components/ui/upos-input'
import { UposRadio as UposRadioElement } from './components/ui/upos-radio'
import { UposRadioGroup as UposRadioGroupElement } from './components/ui/upos-radio-group'
import { UposSelect as UposSelectElement } from './components/ui/upos-select'
import { UposT as UposTElement } from './components/ui/upos-t'
import { UposPayment as UposPaymentElement } from './components/upos-payment'

export const UposPayment = createComponent({
  tagName: 'upos-payment',
  elementClass: UposPaymentElement,
  react: React
})

export const UposInput = createComponent({
  tagName: 'upos-input',
  elementClass: UposInputElement,
  react: React,
  events: {
    onChange: 'change',
    onInput: 'input'
  }
})

export const UposSelect = createComponent({
  tagName: 'upos-select',
  elementClass: UposSelectElement,
  react: React,
  events: {
    onChange: 'change'
  }
})

export const UposButton = createComponent({
  tagName: 'upos-button',
  elementClass: UposButtonElement,
  react: React,
  events: {
    onClick: 'click'
  }
})

export const UposRadio = createComponent({
  tagName: 'upos-radio',
  elementClass: UposRadioElement,
  react: React,
  events: {
    onChange: 'change'
  }
})

export const UposRadioGroup = createComponent({
  tagName: 'upos-radio-group',
  elementClass: UposRadioGroupElement,
  react: React,
  events: {
    onChange: 'change'
  }
})

export const UposT = createComponent({
  tagName: 'upos-t',
  elementClass: UposTElement,
  react: React
})

export const UposCryptoTron = createComponent({
  tagName: 'crypto-tron',
  elementClass: CryptoTronElement,
  react: React
})

export const UposCreditCard = createComponent({
  tagName: 'credit-card',
  elementClass: CreditCardElement,
  react: React
})
