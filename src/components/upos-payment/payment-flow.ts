import { Base64 } from 'js-base64'

import type { PrepareCallback, PaymentData, PrepareResult } from '@src/types'

import { UposError } from '@src/errors'
import { isCryptoTronPayment } from '@src/types/guards'
import { Logger, type LogLevel } from '@src/utils/logger'

import type { PaymentMethod } from '../payment-methods/payment-method'

export interface PaymentSubmitParams {
  payment: PaymentMethod
  host: string
  prepare: PrepareCallback
}

/**
 * Handles payment flow logic including validation, order creation, and URL building
 */
export class PaymentFlow {
  private logger: Logger

  constructor(logLevel: LogLevel = 'error') {
    this.logger = new Logger(logLevel)
  }

  setLogLevel(level: LogLevel) {
    this.logger = new Logger(level)
  }

  /**
   * Handle payment submission
   * @returns Payment URL
   * @throws UposError if validation fails or order creation fails
   */
  async submit(params: PaymentSubmitParams): Promise<string> {
    const { payment, prepare, host } = params

    const validation = payment.validate()
    if (!validation.valid) {
      this.logger.error('Validation failed:', validation.errors)
      throw new UposError('ValidationError', 'Validation failed', validation.errors)
    }

    const payload = payment.getData()
    if (!payload) {
      throw new UposError('PaymentError', 'Unable to get payment data')
    }

    const result = await prepare(payload)

    this.validatePrepareResult(result)
    this.logger.debug('Prepare result:', result)

    return this.buildUrl(result, payload, host)
  }

  /**
   * Validate prepare callback result
   * @throws UposError if result is invalid
   */
  private validatePrepareResult(result: unknown): asserts result is PrepareResult {
    if (!result || typeof result !== 'object') {
      throw new UposError('ValidationError', 'Invalid prepare result')
    }

    const r = result as Record<string, unknown>

    if (typeof r.token !== 'string' || !r.token.trim()) {
      this.logger.error('Prepare result validation failed: missing token')
      throw new UposError('ValidationError', 'Missing or invalid token in prepare result')
    }
  }

  /**
   * Build payment URL from order info and payment data
   */
  private async buildUrl(result: PrepareResult, payment: PaymentData, host: string): Promise<string> {
    if (!isCryptoTronPayment(payment)) {
      throw new UposError('PaymentError', 'Unsupported payment method')
    }

    const config = await fetch(`${host}/v1/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()) as {
      hosts: {
        payment: string
      }
    }

    const payload = Base64.encodeURL(JSON.stringify({
      version: 1,
      token: result.token
    }))

    return `${config.hosts.payment}?payload=${payload}`
  }
}
