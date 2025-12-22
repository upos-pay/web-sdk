import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * Radio option component (must be used with upos-radio-group)
 */
@customElement('upos-radio')
export class UposRadio extends LitElement {
  @property({ type: String })
  value = ''

  @property({ type: Boolean })
  checked = false

  @property({ type: Boolean })
  disabled = false

  @property({ type: String })
  name = ''

  private handleChange(e: Event) {
    // Only process events from the radio input itself
    // Ignore change events from slotted content (like <upos-input>)
    const input = e.target as HTMLInputElement
    if (input.type !== 'radio') {
      return
    }

    if (this.disabled) { return }

    // Only dispatch if the radio is actually being checked
    if (!input.checked) {
      return
    }

    this.dispatchEvent(new CustomEvent('radio-change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }))
  }

  render() {
    return html`
      <label class="radio-label ${this.disabled ? 'disabled' : ''}" part="label">
        <input
          type="radio"
          class="radio-input"
          part="input"
          .value=${this.value}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          name=${this.name}
          @change=${this.handleChange}
        />
        <span class="radio-custom" part="custom-radio"></span>
        <span class="radio-text" part="text">
          <slot></slot>
        </span>
      </label>
    `
  }

  static styles = css`
    :host {
      display: block;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: var(--radio-gap, 10px);
      cursor: pointer;
      user-select: none;
    }

    .radio-label.disabled {
      cursor: not-allowed;
    }

    .radio-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .radio-custom {
      position: relative;
      display: inline-block;
      width: var(--radio-size, 20px);
      height: var(--radio-size, 20px);
      border: 2px solid var(--radio-border-color, #ddd);
      border-radius: 50%;
      background: var(--radio-bg-color, #fff);
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .radio-input:checked + .radio-custom {
      border-color: var(--radio-border-color-checked, rgba(33, 33, 33, 1));
      background: var(--radio-bg-color-checked, rgba(33, 33, 33, 1));
    }

    .radio-input:checked + .radio-custom::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--radio-dot-color, white);
    }

    .radio-input:disabled + .radio-custom {
      background: var(--radio-disabled-bg, #f5f5f5);
      border-color: var(--radio-disabled-border, #ccc);
    }

    .radio-input:focus + .radio-custom {
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    .radio-text {
      color: var(--radio-text-color, #333);
      font-size: var(--radio-font-size, 16px);
    }

    .radio-label.disabled .radio-text {
      color: var(--radio-text-disabled, #999);
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'upos-radio': UposRadio
  }
}
