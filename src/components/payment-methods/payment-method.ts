import { LitElement } from 'lit'

import type { PaymentData, ValidationResult } from '@src/types'

/**
 * Abstract base class defining common interface for all payment method components
 */
export abstract class PaymentMethod extends LitElement {
  /**
   * Validate form data
   * @returns Object containing validation results and error messages
   */
  abstract validate(): ValidationResult

  /**
   * Get complete payment data including method type
   * @returns Complete PaymentData object ready for submission
   */
  abstract getData(): PaymentData
}
