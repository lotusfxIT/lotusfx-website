/** Customer-facing copy when the 4D rate / Click & Collect servers are down. */

export const RATES_UNAVAILABLE_TITLE = "We'll be right back"

export const RATES_UNAVAILABLE_MESSAGE =
  "We're doing a short system update. Live rates will be back shortly. Please try again soon, or visit a branch."

export const CLICK_COLLECT_UNAVAILABLE_MESSAGE =
  "We're doing a short system update. Click & Collect isn't available right now. Please try again shortly, or visit a branch."

const TECHNICAL_MARKERS = [
  'fetch failed',
  'failed to fetch',
  'internal server error',
  'econnrefused',
  'enotfound',
  'etimedout',
  'econnreset',
  'aborterror',
  'the operation was aborted',
  'this operation was aborted',
  'cannot connect',
  'timed out',
  'unreachable',
  'network',
  'http 5',
  'socket',
]

export function isBackendUnavailable(error: unknown): boolean {
  if (!error) return false
  if (typeof error === 'object' && error !== null && 'unavailable' in error) {
    if ((error as { unavailable?: unknown }).unavailable) return true
  }
  const text = (
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === 'string'
        ? error
        : typeof error === 'object' && error !== null && 'error' in error
          ? String((error as { error?: unknown }).error ?? '')
          : String(error)
  ).toLowerCase()
  return TECHNICAL_MARKERS.some((marker) => text.includes(marker))
}

export class BackendUnavailableError extends Error {
  readonly unavailable = true
  constructor(message = RATES_UNAVAILABLE_MESSAGE) {
    super(message)
    this.name = 'BackendUnavailableError'
  }
}

export function publicServiceError(
  error: unknown,
  fallback = RATES_UNAVAILABLE_MESSAGE
): { unavailable: boolean; message: string } {
  if (isBackendUnavailable(error)) {
    return { unavailable: true, message: fallback }
  }
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : fallback
  return { unavailable: isBackendUnavailable(message), message }
}
