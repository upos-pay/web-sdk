import { css } from 'lit'

/**
 * Styles for upos-payment component
 */
export const styles = css`
  :host {
    display: block;
    --payment-bg: transparent;
    --payment-border: transparent;
    --payment-padding: 0;
    --payment-gap: 16px;
    --error-bg: #fef2f2;
    --error-color: #991b1b;
    --error-border: #fecaca;
    --error-border-radius: 6px;
    --error-padding: 10px 14px;
  }

  .payment-container {
    display: flex;
    flex-direction: column;
    gap: var(--payment-gap);
    background: var(--payment-bg);
    border: 1px solid var(--payment-border);
    padding: var(--payment-padding);
    box-sizing: border-box;
  }

  .payment-method-item {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--method-item-border, #d1d5db);
    border-radius: var(--method-item-radius, 8px);
    background: var(--method-item-bg, #fff);
    overflow: var(--method-item-overflow, visible);
    transition: all 0.2s ease;
    padding: 0;
  }

  .payment-method-item:has(upos-radio[checked]) {
    border-color: var(--method-item-border-checked, #3b82f6);
    box-shadow: var(--method-item-shadow-checked, 0 2px 8px rgba(59, 130, 246, 0.15));
  }

  .payment-method-item:not(:has(upos-radio[checked])):hover {
    border-color: var(--method-item-border-hover, #9ca3af);
  }

  .payment-method-item upos-radio::part(label) {
    padding: var(--method-item-padding, 16px 20px);
    cursor: pointer;
  }

  .payment-method-item:has(upos-radio[checked]) upos-radio::part(label),
  .single-method-label {
    padding: var(--method-item-padding, 16px 20px 12px 20px);
  }

  .single-method-label {
    display: block;
    color: var(--radio-text-color, #333);
    font-size: var(--radio-font-size, 16px);
  }

  .payment-method-item.single-method {
    border-color: var(--method-item-border-checked, #3b82f6);
  }

  .payment-form {
    position: relative;
    z-index: 1;
    padding: var(--payment-form-padding, 12px 20px 16px 20px);
    border-top: var(--payment-form-border, 1px solid #e5e7eb);
    margin: var(--payment-form-margin, 0);
  }

  .payment-forms-container {
    margin-top: 0;
  }

  .no-method {
    padding: 32px 16px;
    text-align: center;
    color: #9ca3af;
    font-size: 13px;
  }

  .errors {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .error-item {
    display: flex;
    align-items: center;
    gap: var(--error-icon-gap, 8px);
    background: var(--error-bg);
    color: var(--error-color);
    border: 1px solid var(--error-border);
    border-radius: var(--error-border-radius);
    padding: var(--error-padding);
    font-size: var(--error-font-size, 13px);
  }

  .error-text {
    flex: 1;
  }

  .submit-section {
    display: flex;
    justify-content: flex-end;
  }

  upos-button {
    min-width: 120px;
  }

  /* RTL (Right-to-Left) language support for Arabic, Hebrew, etc. */
  :host(:dir(rtl)) .error-item {
    flex-direction: row-reverse;
  }

  :host(:dir(rtl)) .submit-section {
    justify-content: flex-start;
  }
`
