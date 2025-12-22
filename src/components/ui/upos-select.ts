import { consume } from '@lit/context'
import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import { AppContext, type Context } from '@src/context'

export interface SelectOption {
  label: string
  value: string
  icon?: string
}

@customElement('upos-select')
export class UposSelect extends LitElement {
  @property({ type: String })
  label = ''

  @property({ type: String })
  value = ''

  @property({ type: Array })
  options: SelectOption[] = []

  @property({ type: Boolean })
  disabled = false

  @property({ type: Boolean })
  required = false

  @property({ type: String })
  error = ''

  @property({ type: String })
  name = ''

  @property({ type: String })
  placeholder = ''

  @consume({ context: AppContext, subscribe: true })
  @state()
  private context!: Context

  private handleChange(e: Event) {
    const select = e.target as HTMLSelectElement
    this.value = select.value

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }))
  }

  private get selectedOption(): SelectOption | undefined {
    return this.options.find((opt) => opt.value === this.value)
  }

  render() {
    return html`
      <div class="select-wrapper" part="wrapper">
        ${
          this.label
            ? html`
                  <label class="label" part="label">
                    ${this.label}
                    ${this.required ? html`<span class="required">*</span>` : ''}
                  </label>
                `
            : ''
        }

        <div class="select-container" part="select-container">
          ${
            this.selectedOption?.icon
              ? html`
                  <img src="${this.selectedOption.icon}" alt="" class="select-icon" />
                `
              : ''
          }

          <select
            part="select"
            class="select ${this.error ? 'error' : ''}"
            .value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            name=${this.name || ''}
            @change=${this.handleChange}
          >
            <option value="" disabled ?selected=${!this.value}>
              ${this.placeholder || this.context.t('ui.select.placeholder')}
            </option>
            ${
              this.options.map((option) => html`
                <option
                  value=${option.value}
                  ?selected=${this.value === option.value}
                >
                  ${option.label}
                </option>
              `)
            }
          </select>

          <svg class="arrow-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7167 15L9 17.6942L23.4936 32L26.2232 29.3185L38 17.6942L35.2833 15L23.4936 26.6369L11.7167 15Z" />
          </svg>
        </div>

        ${
          this.error
            ? html`
              <div class="error-message" part="error">
                ${this.error}
              </div>
            `
            : ''
        }
      </div>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    .select-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing, 6px);
    }

    .label {
      color: var(--label-color, #374151);
      font-size: var(--label-font-size, 13px);
      font-weight: 500;
    }

    .required {
      color: var(--error-color, #ef4444);
      margin-left: 2px;
    }

    .select-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .select-icon {
      position: absolute;
      left: 10px;
      width: var(--icon-size, 20px);
      height: var(--icon-size, 20px);
      pointer-events: none;
      z-index: 1;
    }

    .arrow-icon {
      position: absolute;
      right: 10px;
      width: 12px;
      height: 12px;
      pointer-events: none;
      opacity: 0.5;
      fill: currentColor;
    }

    .select {
      padding: var(--select-padding, 8px 10px);
      padding-right: 32px;
      border: 1px solid var(--select-border-color, #d1d5db);
      border-radius: var(--select-border-radius, 6px);
      font-size: var(--select-font-size, 15px);
      color: var(--select-text-color, #111827);
      background: var(--select-bg-color, #fff);
      transition: border-color 0.15s;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    .select-container:has(.select-icon) .select {
      padding-left: calc(var(--icon-size, 20px) + 20px);
    }

    .select:focus {
      outline: none;
      border-color: var(--select-border-color-focus, #3b82f6);
    }

    .select.error {
      border-color: var(--select-border-color-error, #ef4444);
    }

    .select:disabled {
      background: var(--select-disabled-bg, #f9fafb);
      color: var(--select-disabled-text, #9ca3af);
      cursor: not-allowed;
    }

    .error-message {
      color: var(--error-color, #ef4444);
      font-size: var(--error-font-size, 12px);
    }

    /* RTL (Right-to-Left) language support */
    :host(:dir(rtl)) .required {
      margin-left: 0;
      margin-right: 2px;
    }

    :host(:dir(rtl)) .select-icon {
      left: auto;
      right: 10px;
    }

    :host(:dir(rtl)) .arrow-icon {
      right: auto;
      left: 10px;
    }

    :host(:dir(rtl)) .select {
      padding: 8px 10px 8px 32px;
    }

    :host(:dir(rtl)) .select-container:has(.select-icon) .select {
      padding: 8px calc(var(--icon-size, 20px) + 20px) 8px 32px;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'upos-select': UposSelect
  }
}
