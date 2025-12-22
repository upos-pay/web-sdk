import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Customizable input field component
 */
@customElement('upos-input')
export class UposInput extends LitElement {
  @property({ type: String })
  label = ''

  @property({ type: String })
  value = ''

  @property({ type: String })
  type: 'email' | 'password' | 'tel' | 'text' = 'text'

  @property({ type: String })
  placeholder = ''

  @property({ type: Boolean })
  disabled = false

  @property({ type: Boolean })
  required = false

  @property({ type: String })
  error = ''

  @property({ type: String })
  name = ''

  @property({ type: Number })
  maxlength?: number

  /**
   * Input mask pattern. Use '#' for digits, '@' for letters, '*' for any character.
   * Example: "#### #### #### ####" for credit card, "##/##" for expiry
   */
  @property({ type: String })
  mask?: string

  /**
   * Field name for registration with parent components
   * Maps to data-field attribute
   */
  @property({ type: String, attribute: 'data-field' })
  fieldName?: string

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    let processedValue = input.value

    // Apply mask if provided
    if (this.mask) {
      processedValue = this.applyMask(input.value, this.mask)

      // Update input value if masked
      if (processedValue !== input.value) {
        const cursorPos = processedValue.length
        input.value = processedValue
        input.setSelectionRange(cursorPos, cursorPos)
      }
    }

    this.value = processedValue

    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }))
  }

  /**
   * Apply mask pattern to input value
   * # = digit, @ = letter, * = any character
   */
  private applyMask(value: string, mask: string): string {
    let maskedValue = ''
    let valueIndex = 0

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      const maskChar = mask[i]
      const valueChar = value[valueIndex]

      if (maskChar === '#') {
        // Only allow digits
        if (/\d/.test(valueChar)) {
          maskedValue += valueChar
          valueIndex++
        } else {
          // Skip non-digit characters in input
          valueIndex++
          i--
        }
      } else if (maskChar === '@') {
        // Only allow letters
        if (/[a-zA-Z]/.test(valueChar)) {
          maskedValue += valueChar
          valueIndex++
        } else {
          valueIndex++
          i--
        }
      } else if (maskChar === '*') {
        // Allow any character
        maskedValue += valueChar
        valueIndex++
      } else {
        // Literal character (space, slash, dash, etc.)
        maskedValue += maskChar
        if (valueChar === maskChar) {
          valueIndex++
        }
      }
    }

    return maskedValue
  }

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement
    this.value = input.value

    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }))
  }

  render() {
    return html`
      <div class="input-wrapper" part="wrapper">
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
        <input
          part="input"
          class="input ${this.error ? 'error' : ''}"
          type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          ?required=${this.required}
          name=${this.name}
          maxlength=${this.maxlength ?? ''}
          @input=${this.handleInput}
          @change=${this.handleChange}
        />

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

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing, 8px);
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

    .input {
      padding: var(--input-padding, 8px 10px);
      border: 1px solid var(--input-border-color, #d1d5db);
      border-radius: var(--input-border-radius, 6px);
      font-size: var(--input-font-size, 14px);
      color: var(--input-text-color, #111827);
      background: var(--input-bg-color, #fff);
      transition: border-color 0.2s ease;
      font-family: inherit;
      width: 100%;
      box-sizing: border-box;
    }

    .input::placeholder {
      color: var(--input-placeholder-color, #9ca3af);
    }

    .input:focus {
      outline: none;
      border-color: var(--input-border-color-focus, #3b82f6);
    }

    .input.error {
      border-color: var(--input-border-color-error, #ef4444);
    }

    .input:disabled {
      background: var(--input-disabled-bg, #f9fafb);
      color: var(--input-disabled-text, #9ca3af);
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
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'upos-input': UposInput
  }
}
