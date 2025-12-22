/**
 * Slot helper utilities for type-safe slot operations
 */

interface ElementWithValue {
  value?: unknown
}

export function hasSlotContent(
  shadowRoot: ShadowRoot | null,
  slotName: string
): boolean {
  if (!shadowRoot) { return false }

  const slot = shadowRoot.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement
  if (!slot) { return false }

  const elements = slot.assignedElements()
  return elements.length > 0
}

/**
 * Handles nested slots by recursively resolving slot elements
 */
export function getSlotElement<T extends HTMLElement = HTMLElement>(
  shadowRoot: ShadowRoot | null,
  slotName: string
): T | null {
  if (!shadowRoot) { return null }

  const slot = shadowRoot.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement
  if (!slot) { return null }

  const elements = slot.assignedElements()
  if (elements.length === 0) { return null }

  let element = elements[0]

  // Resolve nested slot forwarding (e.g., <slot slot="x"> -> <upos-input>)
  while (element instanceof HTMLSlotElement) {
    const nestedElements = element.assignedElements()
    if (nestedElements.length === 0) { return null }
    element = nestedElements[0]
  }

  return element as T
}

/**
 * Handles nested slots by recursively resolving slot elements
 */
export function getSlotElements<T extends HTMLElement = HTMLElement>(
  shadowRoot: ShadowRoot | null,
  slotName: string
): T[] {
  if (!shadowRoot) { return [] }

  const slot = shadowRoot.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement
  if (!slot) { return [] }

  const elements = slot.assignedElements()

  // Resolve nested slot forwarding
  const resolvedElements: Element[] = []
  for (let element of elements) {
    while (element instanceof HTMLSlotElement) {
      const nestedElements = element.assignedElements()
      if (nestedElements.length === 0) { break }
      element = nestedElements[0]
    }
    resolvedElements.push(element)
  }

  return resolvedElements as T[]
}

export function getSlotValue<T>(
  shadowRoot: ShadowRoot | null,
  slotName: string,
  fallback: T
): T {
  const element = getSlotElement(shadowRoot, slotName)

  if (!element) {
    return fallback
  }

  const value = (element as ElementWithValue).value

  return value !== undefined && value !== null ? (value as T) : fallback
}

export function getSlotValueOrDefault<T>(
  shadowRoot: ShadowRoot | null,
  slotName: string,
  defaultSelector: string,
  fallback: T
): T {
  const slotElement = getSlotElement(shadowRoot, slotName)

  if (slotElement) {
    const value = (slotElement as ElementWithValue).value
    return value !== undefined && value !== null ? (value as T) : fallback
  }

  if (!shadowRoot) { return fallback }

  const defaultElement = shadowRoot.querySelector(defaultSelector)
  if (!defaultElement) { return fallback }

  const value = (defaultElement as ElementWithValue).value
  return value !== undefined && value !== null ? (value as T) : fallback
}

/**
 * Recommended: uses data-field attribute for stable element selection
 */
export function getSlotValueOrField<T>(
  shadowRoot: ShadowRoot | null,
  slotName: string,
  fieldName: string,
  fallback: T
): T {
  const slotElement = getSlotElement(shadowRoot, slotName)

  if (slotElement) {
    const value = (slotElement as ElementWithValue).value
    return value !== undefined && value !== null ? (value as T) : fallback
  }

  if (!shadowRoot) { return fallback }

  const fieldElement = shadowRoot.querySelector(`[data-field="${fieldName}"]`)
  if (!fieldElement) { return fallback }

  const value = (fieldElement as ElementWithValue).value
  return value !== undefined && value !== null ? (value as T) : fallback
}
