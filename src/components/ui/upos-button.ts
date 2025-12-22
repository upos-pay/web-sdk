import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('upos-button')
export class UposButton extends LitElement {
  @property({ type: Boolean })
  disabled = false

  @property({ type: Boolean })
  loading = false

  @property({ type: String })
  variant: 'primary' | 'secondary' = 'primary'

  @property({ type: String, attribute: 'loading-text' })
  loadingText = ''

  render() {
    return html`
      <button
        part="button"
        class="button ${this.variant} ${this.loading ? 'loading' : ''}"
        ?disabled=${this.disabled || this.loading}
      >
        ${this.loading ? html`<span class="spinner" part="spinner"></span>` : ''}
        ${this.loading && this.loadingText ? html`<span class="loading-text" part="loading-text">${this.loadingText}</span>` : ''}
        <span class="content ${this.loading ? 'hidden' : ''}" part="content">
          <slot></slot>
        </span>
      </button>
    `
  }

  static styles = css`
    :host {
      display: block;
      width: var(--button-width, 100%);
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      padding: var(--button-padding, 10px 20px);
      border: none;
      border-radius: var(--button-border-radius, 6px);
      font-size: var(--button-font-size, 14px);
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background-color 0.15s;
      box-sizing: border-box;
    }

    .button.primary {
      background: var(--button-primary-bg, rgba(33, 33, 33, 1));
      color: var(--button-primary-text, #fff);
    }

    .button.primary:hover:not(:disabled) {
      background: var(--button-primary-hover, rgba(50, 50, 50, 1));
    }

    .button.secondary {
      background: var(--button-secondary-bg, #6b7280);
      color: var(--button-secondary-text, #fff);
    }

    .button.secondary:hover:not(:disabled) {
      background: var(--button-secondary-hover, #4b5563);
    }

    .button:disabled {
      background: var(--button-disabled-bg, #e5e7eb);
      color: var(--button-disabled-text, #9ca3af);
      cursor: not-allowed;
    }

    .button.loading .content {
      opacity: 0.7;
    }

    .content.hidden {
      display: none;
    }

    .loading-text {
      font-size: inherit;
      font-weight: inherit;
      color: inherit;
    }

    .spinner {
      display: inline-block;
      width: var(--spinner-size, 14px);
      height: var(--spinner-size, 14px);
      border: var(--spinner-border-width, 2px) solid var(--spinner-border-color, rgba(255, 255, 255, 0.3));
      border-top-color: var(--spinner-color, currentColor);
      border-radius: 50%;
      animation: spin var(--spinner-duration, 0.8s) linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'upos-button': UposButton
  }
}
