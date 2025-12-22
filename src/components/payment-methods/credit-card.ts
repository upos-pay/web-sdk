import { consume } from '@lit/context'
import { html, css } from 'lit'
import { customElement, state, queryAssignedElements } from 'lit/decorators.js'

import '@src/components/ui/upos-input'

import type { CreditCardData, ValidationResult, PaymentData } from '@src/types'

import { PaymentMethod } from '@src/components/payment-methods/payment-method'
import { UposInput } from '@src/components/ui/upos-input'
import { AppContext, type Context } from '@src/context'
import { getSlotValueOrField } from '@src/utils/slot-helpers'

/**
 * Credit card payment method component
 */
@customElement('credit-card')
export class CreditCard extends PaymentMethod {
  @consume({ context: AppContext, subscribe: true })
  @state()
  private context!: Context

  @state()
  private isAmex = false

  /**
   * Reactively queries for elements assigned to the 'cvv-input' slot.
   * Lit automatically keeps this array up-to-date.
   */
  @queryAssignedElements({ slot: 'cvv-input', flatten: true })
  private cvvInputs!: UposInput[]

  /**
   * Detects card type from the card number input and updates state.
   */
  private handleCardNumberInput(e: Event) {
    // Ensure the event comes from a upos-input component
    const target = e.target as UposInput
    if (!target.matches('upos-input')) {
      return
    }

    const cardNumber = target.value || ''
    const digits = cardNumber.replace(/\D/g, '')

    // American Express cards start with 34 or 37
    const newIsAmex = /^3[47]/.test(digits)

    if (newIsAmex !== this.isAmex) {
      this.isAmex = newIsAmex
      this.updateCvvMaxLength()
    }
  }

  /**
   * Updates the maxlength property on all slotted CVV input components.
   */
  private updateCvvMaxLength() {
    // Find the first UposInput element in the slot's assigned nodes.
    const cvvInput = this.cvvInputs.find((node) => node instanceof UposInput)

    if (cvvInput) {
      cvvInput.maxlength = this.isAmex ? 4 : 3
    }
  }

  /**
   * Lit lifecycle method called after the component's DOM has been updated.
   * We use this to set the initial maxlength for any slotted CVV inputs.
   */
  protected updated(changedProperties: Map<number | string | symbol, unknown>): void {
    super.updated(changedProperties)

    // Update CVV maxlength if isAmex changes OR if the slotted CVV inputs change
    if (changedProperties.has('isAmex') || changedProperties.has('cvvInputs')) {
      this.updateCvvMaxLength()
    }
  }

  validate(): ValidationResult {
    const errors: string[] = []
    const formData = this.getFormData()

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      errors.push(this.context.t('card.validation.invalidCardNumber'))
    }

    if (!formData.cardHolder) {
      errors.push(this.context.t('card.validation.holderRequired'))
    }

    if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      errors.push(this.context.t('card.validation.invalidExpiry'))
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      errors.push(this.context.t('card.validation.invalidCvv'))
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  getData(): PaymentData {
    return {
      method: 'credit_card',
      data: this.getFormData()
    }
  }

  /**
   * Get raw form data
   */
  private getFormData(): CreditCardData {
    return {
      cardNumber: getSlotValueOrField<string>(
        this.shadowRoot,
        'card-number-input',
        'cardNumber',
        ''
      ),
      cardHolder: getSlotValueOrField<string>(
        this.shadowRoot,
        'card-holder-input',
        'cardHolder',
        ''
      ),
      expiry: getSlotValueOrField<string>(
        this.shadowRoot,
        'expiry-input',
        'expiry',
        ''
      ),
      cvv: getSlotValueOrField<string>(
        this.shadowRoot,
        'cvv-input',
        'cvv',
        ''
      )
    }
  }

  render() {
    return html`
      <div class="credit-card-form" part="form">
        <slot name="card-number-input" @input=${this.handleCardNumberInput}>
          <upos-input
            data-field="cardNumber"
            label=${this.context.t('card.labels.cardNumber')}
            placeholder=${this.context.t('card.placeholders.cardNumber')}
            mask="#### #### #### ####"
            maxlength=${19}
          />
        </slot>

        <slot name="card-holder-input">
          <upos-input
            data-field="cardHolder"
            label=${this.context.t('card.labels.cardHolder')}
            placeholder=${this.context.t('card.placeholders.cardHolder')}
          />
        </slot>

        <div class="form-row-half">
          <slot name="expiry-input">
            <upos-input
              data-field="expiry"
              label=${this.context.t('card.labels.expiry')}
              placeholder=${this.context.t('card.placeholders.expiry')}
              mask="##/##"
              maxlength=${5}
            />
          </slot>

          <slot name="cvv-input">
            <upos-input
              data-field="cvv"
              label=${this.context.t('card.labels.cvv')}
              placeholder=${this.isAmex ? this.context.t('card.placeholders.cvvAmex') : this.context.t('card.placeholders.cvv')}
              type="password"
              maxlength=${this.isAmex ? 4 : 3}
            />
          </slot>
        </div>
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
      --form-gap: 16px;
    }

    .credit-card-form {
      display: flex;
      flex-direction: column;
      gap: var(--form-gap);
    }

    .form-row {
      width: 100%;
    }

    .form-row-half {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--form-gap);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'credit-card': CreditCard
  }
}
