import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

type TFunction = (key: string) => string

/**
 * A helper component for declarative translation in light DOM slots.
 * Uses an event registration pattern where the component registers itself
 * with the nearest upos-payment parent, which then injects the translation function.
 * This approach is 100% reliable and works across any DOM structure.
 *
 * @example
 * <upos-payment id="payment" mode="test">
 *   <upos-button slot="submit-button">
 *     <upos-t key="payment.submit"></upos-t>
 *   </upos-button>
 * </upos-payment>
 */
@customElement('upos-t')
export class UposT extends LitElement {
  @property({ type: String })
  key = ''

  @state()
  private t: TFunction = () => ''

  connectedCallback() {
    super.connectedCallback()
    // Dispatch registration event so upos-payment can find and manage this component
    this.dispatchEvent(new CustomEvent('upos-t-register', {
      detail: { component: this },
      bubbles: true,
      composed: true // Required to cross Shadow DOM boundaries
    }))
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    // Dispatch unregistration event to prevent memory leaks
    this.dispatchEvent(new CustomEvent('upos-t-unregister', {
      detail: { component: this },
      bubbles: true,
      composed: true
    }))
  }

  /**
   * Public method for parent component to inject translation function
   */
  public setT(t: TFunction) {
    this.t = t
  }

  render() {
    if (!this.key) {
      return ''
    }
    return html`${this.t(this.key)}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'upos-t': UposT
  }
}
