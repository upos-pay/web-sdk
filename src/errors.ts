export type UposErrorType
  = | 'ConfigError'
  | 'PaymentError'
  | 'ValidationError'

export class UposError extends Error {
  public errors?: string[]

  constructor(
    public type: UposErrorType,
    message: string,
    errors?: string[]
  ) {
    super(message)
    this.name = 'UposError'
    this.errors = errors
  }
}
