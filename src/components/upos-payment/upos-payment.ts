import { provide } from '@lit/context'
import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { unsafeStatic, html as staticHtml } from 'lit/static-html.js'

import '../ui/upos-button'
import '../ui/upos-radio'
import '../ui/upos-radio-group'
import '../ui/upos-t'
import '../payment-methods/crypto-tron'
import '../payment-methods/credit-card'

import type { SupportedLocale, Translations } from '@src/i18n'
import type {
  PaymentMethodType,
  PrepareCallback
} from '@src/types'
import type { LogLevel } from '@src/utils/logger'

import { getApiHost } from '@src/config/env'
import { AppContext, type Context } from '@src/context'
import { UposError } from '@src/errors'
import { createTranslation } from '@src/i18n'

import type { PaymentMethod } from '../payment-methods/payment-method'

import { ContextManager } from './context-manager'
import * as methods from './methods'
import { PaymentFlow } from './payment-flow'
import { SlotManager } from './slot-manager'
import { styles } from './styles'

@customElement('upos-payment')
export class UposPayment extends LitElement {
  /**
   * Public key for authentication and environment detection.
   * - Keys starting with `pk_live_` use production API (real transactions)
   * - All other keys use test API (sandbox)
   * @required
   */
  @property({ type: String, attribute: 'public-key' })
  publicKey?: string

  /**
   * Custom API host URL to override the default environment-based endpoints.
   * Useful for custom deployments or staging environments.
   */
  @property({ type: String, attribute: 'api-host' })
  apiHost?: string

  /**
   * Callback to get payment parameters before redirect.
   * Called when user submits, should return order info and redirect URLs.
   */
  @property({ type: Object })
  prepare?: PrepareCallback

  /**
   * Log level for SDK debugging.
   * - `error`: Only errors
   * - `warn`: Warnings and errors
   * - `info`: Info, warnings, and errors
   * - `debug`: All logs including debug
   * @default 'warn'
   */
  @property({ type: String, attribute: 'log-level' })
  logLevel: LogLevel = 'warn'

  /**
   * The default payment method to be pre-selected when the component loads.
   * @default 'crypto_tron'
   */
  @property({ type: String, attribute: 'default-method' })
  defaultMethod: PaymentMethodType = 'crypto_tron'

  /**
   * The locale for internationalization. Determines which language to use
   * for all UI text and labels in the payment interface.
   * Supported locales: 'en-US' (English), 'zh-TW' (Traditional Chinese)
   * @default 'en-US'
   */
  @property({ type: String })
  locale: SupportedLocale = 'en-US'

  /**
   * Custom translations to override the default locale translations.
   * Accepts a partial translation object with dot-notation keys.
   * Custom translations take the highest priority in the fallback chain.
   * Can be set via JavaScript property or as JSON string attribute.
   */
  @property({
    type: Object,
    converter: {
      fromAttribute: (value: string | null) => {
        if (!value) { return undefined }
        try {
          return JSON.parse(value)
        } catch (e) {
          console.warn('Invalid translations JSON:', value)
          return undefined
        }
      }
    }
  })
  translations?: Partial<Translations>

  @provide({ context: AppContext })
  @state()
  private context: Context = {
    locale: this.locale,
    translations: this.translations,
    t: createTranslation(this.locale, this.translations)
  }

  @state()
  private selectedMethod: PaymentMethodType = 'crypto_tron'

  @state()
  private isSubmitting = false

  @state()
  private errors: string[] = []

  @state()
  private hasCustomMethodSelector = false

  private submitButtonSlot?: HTMLSlotElement

  // Manager instances
  private contextManager!: ContextManager
  private slotManager!: SlotManager
  private paymentFlow!: PaymentFlow

  constructor() {
    super()

    // Initialize managers
    this.contextManager = new ContextManager(this)
    this.slotManager = new SlotManager(this)
    this.paymentFlow = new PaymentFlow(this.logLevel)

    // Set up context manager event listeners
    this.contextManager.setupEventListeners()
  }

  connectedCallback() {
    super.connectedCallback()

    if (!this.publicKey) {
      throw new UposError('ConfigError', 'public-key is required')
    }

    this.selectedMethod = this.defaultMethod

    // Scan and register all existing upos-t elements in light DOM
    this.contextManager.scanAndRegisterExisting(this.context.t)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    // Clean up submit button listener
    if (this.submitButtonSlot) {
      this.submitButtonSlot.removeEventListener('click', this.onSubmit)
    }

    this.contextManager.removeEventListeners()
    this.contextManager.clear()
  }

  firstUpdated() {
    // Sync log level from attribute (constructor runs before attribute parsing)
    this.paymentFlow.setLogLevel(this.logLevel)

    // Get submit button slot and bind click listener
    this.submitButtonSlot = this.shadowRoot?.querySelector('slot[name="submit-button"]') as HTMLSlotElement
    if (this.submitButtonSlot) {
      this.submitButtonSlot.addEventListener('click', this.onSubmit)
    }
  }

  willUpdate(changedProperties: Map<string, unknown>) {
    // Update context when locale or translations change
    // Do this in willUpdate to avoid triggering additional update cycles
    if (changedProperties.has('locale') || changedProperties.has('translations')) {
      this.context = {
        locale: this.locale,
        translations: this.translations,
        t: createTranslation(this.locale, this.translations)
      }
    }
  }

  updated(changedProperties: Map<string, unknown>) {
    // Sync payment flow handler when logLevel property changes
    if (changedProperties.has('logLevel')) {
      this.paymentFlow.setLogLevel(this.logLevel)
    }

    // Update all registered upos-t components when context changes
    if (changedProperties.has('locale') || changedProperties.has('translations')) {
      this.contextManager.updateAllTranslations(this.context.t)
    }

    // Update slotted buttons when loading state changes
    if (changedProperties.has('isSubmitting')) {
      this.slotManager.updateSlotButton(this.submitButtonSlot, this.isSubmitting)
      // Expose state to host element for external CSS
      this.setAttribute('data-loading', this.isSubmitting ? 'true' : 'false')
    }
  }

  private get resolvedApiHost(): string {
    if (this.apiHost) { return this.apiHost }
    if (this.publicKey) { return getApiHost(this.publicKey) }
    throw new UposError('ConfigError', 'Must provide either public-key')
  }

  private checkCustomMethodSelector() {
    this.hasCustomMethodSelector = this.slotManager.checkCustomMethodSelector(this.shadowRoot)
  }

  private onSubmit = (e: Event) => {
    const button = (e.target as HTMLElement).closest('button, upos-button')
    if (button && !this.isSubmitting) {
      this.handleSubmit()
    }
  }

  private onMethodChange = (e: Event) => {
    // Only handle events from upos-radio-group itself
    if (e.target !== e.currentTarget) { return }

    // Only handle CustomEvent with detail.value from upos-radio-group
    if (!(e instanceof CustomEvent) || !e.detail || e.detail.value === undefined) { return }

    this.selectedMethod = e.detail.value as PaymentMethodType
    this.errors = []
  }

  private async handleSubmit() {
    if (!this.prepare) {
      this.errors = ['Missing prepare callback']
      return
    }

    try {
      this.isSubmitting = true
      this.errors = []

      const payment = this.getPaymentMethod()
      if (!payment) {
        throw new UposError('PaymentError', 'Unable to get payment method component')
      }

      const url = await this.paymentFlow.submit({
        payment,
        prepare: this.prepare,
        host: this.resolvedApiHost
      })

      window.location.assign(url)
    } catch (error) {
      if (error instanceof UposError && error.errors?.length) {
        this.errors = error.errors
      } else {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Failed to create order'
        this.errors = [errorMessage]
      }
    } finally {
      this.isSubmitting = false
    }
  }

  private getPaymentMethod(): PaymentMethod | null {
    const method = methods.find(this.selectedMethod)
    if (!method) { return null }
    return this.shadowRoot?.querySelector<PaymentMethod>(method.tag) || null
  }

  private renderPaymentForms() {
    const method = methods.find(this.selectedMethod)
    if (!method) {
      return html`<div class="no-method">${this.context.t('payment.errors.noMethod')}</div>`
    }
    return this.renderMethodComponent(method.tag, method.slots)
  }

  private renderDefaultMethodSelector() {
    if (methods.list.length === 1) {
      const method = methods.list[0]
      return html`
        <div class="payment-method-item single-method" part="payment-method-item">
          <div class="single-method-label" part="method-label">
            <slot name=${method.slotName}>${this.context.t(method.nameKey)}</slot>
          </div>
          <div class="payment-form" part=${method.formPart}>
            ${this.renderMethodComponent(method.tag, method.slots)}
          </div>
        </div>
      `
    }

    return html`
      <upos-radio-group
        .value=${this.selectedMethod}
        name="payment-method"
        @change=${this.onMethodChange}
      >
        ${methods.list.map((method) => html`
          <div class="payment-method-item" part="payment-method-item">
            <upos-radio value=${method.method} exportparts="label: method-label">
              <slot name=${method.slotName}>${this.context.t(method.nameKey)}</slot>
            </upos-radio>
            ${
              this.selectedMethod === method.method
                ? html`
                    <div class="payment-form" part=${method.formPart}>
                      ${this.renderMethodComponent(method.tag, method.slots)}
                    </div>
                  `
                : ''
            }
          </div>
        `)}
      </upos-radio-group>
    `
  }

  /**
   * Dynamically render a payment method component by tag name
   * Only forward slots that have actual content to avoid overriding default content
   */
  private renderMethodComponent(tagName: string, slots: readonly string[]) {
    const tag = unsafeStatic(tagName)

    // Build slot forwarding HTML
    const slotForwarding = slots
      .filter((slotName) => this.slotManager.hasContent(slotName))
      .map((slotName) => staticHtml`<slot name="${unsafeStatic(slotName)}" slot="${unsafeStatic(slotName)}"></slot>`)

    return staticHtml`<${tag}>${slotForwarding}</${tag}>`
  }

  render() {
    return html`
      <div class="payment-container" part="container">
        <div class="method-selector" part="method-selector">
          <slot name="method-selector-override" @slotchange=${this.checkCustomMethodSelector}>
            ${this.renderDefaultMethodSelector()}
          </slot>
        </div>

        <!-- Always render payment forms, even when using custom selector -->
        <div class="payment-forms-container" part="payment-forms" style="${this.hasCustomMethodSelector ? 'display: block;' : 'display: none;'}">
          ${this.renderPaymentForms()}
        </div>

        ${
          this.errors.length > 0
            ? html`
                <div class="errors" part="errors">
                  ${this.errors.map((error) => html`
                    <div class="error-item" part="error-item">
                      <slot name="error-icon">⚠️</slot>
                      <span class="error-text">${error}</span>
                    </div>
                  `)}
                </div>
              `
            : ''
        }

        <div class="submit-section" part="submit-section" data-loading="${this.isSubmitting}">
          <slot name="submit-button" @click=${this.handleSubmit}>
            <upos-button
              ?loading=${this.isSubmitting}
              ?disabled=${this.isSubmitting}
            >
              ${this.context.t('payment.submit')}
            </upos-button>
          </slot>
        </div>
      </div>
    `
  }

  static styles = styles
}

declare global {
  interface HTMLElementTagNameMap {
    'upos-payment': UposPayment
  }
}
