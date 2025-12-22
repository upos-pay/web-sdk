/**
 * Environment Configuration
 * Maps payment mode to API host URLs
 */

const ENV_CONFIG = {
  production: import.meta.env.VITE_API_HOST_PROD || 'https://api.upos.fi',
  test: import.meta.env.VITE_API_HOST_TEST || 'https://api.upos.fi'
} as const

/**
 * Derive payment mode from public key prefix
 * @param publicKey - Public key (pk_live_* for production, anything else for test)
 * @returns Payment mode
 */
export function getModeFromPublicKey(publicKey: string): 'production' | 'test' {
  if (publicKey.startsWith('pk_live_')) {
    return 'production'
  }
  return 'test'
}

/**
 * Get API host URL by public key
 * @param publicKey - Public key to derive mode from
 * @returns API host URL
 */
export function getApiHost(publicKey: string): string {
  const mode = getModeFromPublicKey(publicKey)
  return ENV_CONFIG[mode]
}
