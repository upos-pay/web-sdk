import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import type { UposRadio } from './upos-radio'

@customElement('upos-radio-group')
export class UposRadioGroup extends LitElement {
  @property({ type: String })
  value = ''

  @property({ type: String })
  name = ''

  @property({ type: String })
  label = ''

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('radio-change', this.handleRadioChange)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('radio-change', this.handleRadioChange)
  }

  private handleRadioChange = (e: Event) => {
    e.stopPropagation()
    const newValue = (e as CustomEvent).detail?.value

    if (!newValue || typeof newValue !== 'string') {
      return
    }

    if (newValue !== this.value) {
      this.value = newValue
      this.updateRadios()

      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true
      }))
    }
  }

  private updateRadios() {
    const slot = this.shadowRoot?.querySelector('slot')
    if (!slot) { return }

    // Get all assigned elements (including wrapper divs)
    const assignedElements = slot.assignedElements({ flatten: true })

    // Find all upos-radio elements, including those nested in wrapper elements
    const radios: UposRadio[] = []
    assignedElements.forEach((el) => {
      if (el.tagName === 'UPOS-RADIO') {
        radios.push(el as UposRadio)
      } else {
        // Look for nested radio elements
        const nestedRadios = el.querySelectorAll('upos-radio')
        nestedRadios.forEach((radio) => radios.push(radio as UposRadio))
      }
    })

    radios.forEach((el) => {
      el.checked = el.value === this.value
      el.name = this.name
    })
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('value') || changedProperties.has('name')) {
      this.updateRadios()
    }
  }

  firstUpdated() {
    // Initial radio sync after first render
    this.updateRadios()
  }

  render() {
    return html`
      <div class="radio-group" part="group" role="radiogroup">
        ${
          this.label
            ? html`
              <div class="group-label" part="label">
                ${this.label}
              </div>
            `
            : ''
        }
        <div class="radio-options" part="options">
          <slot></slot>
        </div>
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--group-gap, 10px);
    }

    .group-label {
      color: var(--group-label-color, #374151);
      font-size: var(--group-label-font-size, 13px);
      font-weight: 500;
    }

    .radio-options {
      display: flex;
      flex-direction: column;
      gap: var(--options-gap, 12px);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'upos-radio-group': UposRadioGroup
  }
}
