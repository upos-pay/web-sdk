import { consume } from '@lit/context'
import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import '@src/components/ui/upos-select'

import type { ValidationResult, PaymentData } from '@src/types'

import tronIcon from '@src/assets/tron.png'
import usdtIcon from '@src/assets/usdt.png'
import { PaymentMethod } from '@src/components/payment-methods/payment-method'
import { AppContext, type Context } from '@src/context'
import { getSlotValue } from '@src/utils/slot-helpers'

@customElement('crypto-tron')
export class CryptoTron extends PaymentMethod {
  @property({ type: String })
  network: 'tron' = 'tron' as const

  @property({ type: String })
  currency: 'usdt' = 'usdt' as const

  @consume({ context: AppContext, subscribe: true })
  @state()
  private context!: Context

  private get networkOptions() {
    return [
      { label: this.context.t('crypto.options.tron'), value: 'tron', icon: tronIcon }
    ]
  }

  private get currencyOptions() {
    return [
      { label: this.context.t('crypto.options.usdt'), value: 'usdt', icon: usdtIcon }
    ]
  }

  private handleNetworkChange(e: CustomEvent) {
    this.network = e.detail.value as 'tron'

    this.dispatchEvent(new CustomEvent('method-change', {
      detail: this.getData(),
      bubbles: true,
      composed: true
    }))
  }

  private handleCurrencyChange(e: CustomEvent) {
    this.currency = e.detail.value as 'usdt'

    this.dispatchEvent(new CustomEvent('method-change', {
      detail: this.getData(),
      bubbles: true,
      composed: true
    }))
  }

  getData(): PaymentData {
    return {
      method: 'crypto_tron',
      data: {
        network: getSlotValue<'tron'>(this.shadowRoot, 'network-select', this.network),
        currency: getSlotValue<'usdt'>(this.shadowRoot, 'currency-select', this.currency)
      }
    }
  }

  validate(): ValidationResult {
    const errors: string[] = []

    if (!this.network) {
      errors.push(this.context.t('crypto.validation.networkRequired'))
    }

    if (!this.currency) {
      errors.push(this.context.t('crypto.validation.currencyRequired'))
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  render() {
    return html`
      <div class="crypto-form" part="form">
        <slot name="network-select">
          <upos-select
            label=${this.context.t('crypto.labels.network')}
            .value=${this.network}
            .options=${this.networkOptions}
            @change=${this.handleNetworkChange}
          />
        </slot>

        <slot name="currency-select">
          <upos-select
            label=${this.context.t('crypto.labels.currency')}
            .value=${this.currency}
            .options=${this.currencyOptions}
            @change=${this.handleCurrencyChange}
          />
        </slot>
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    .crypto-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'crypto-tron': CryptoTron
  }
}
