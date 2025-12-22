import type { createTranslation } from '@src/i18n'

import type { UposT } from '../ui/upos-t'

type TranslationFunction = ReturnType<typeof createTranslation>

/**
 * Manages translation context and upos-t component registration
 */
export class ContextManager {
  /**
   * Track all registered upos-t components for translation updates
   */
  private registeredTElements = new Set<UposT>()

  constructor(private host: HTMLElement) {
    // Bind event handlers to maintain correct 'this' context
    this.handleTRegister = this.handleTRegister.bind(this)
    this.handleTUnregister = this.handleTUnregister.bind(this)
  }

  /**
   * Initialize event listeners for upos-t registration
   */
  setupEventListeners() {
    this.host.addEventListener('upos-t-register', this.handleTRegister)
    this.host.addEventListener('upos-t-unregister', this.handleTUnregister)
  }

  /**
   * Remove event listeners to prevent memory leaks
   */
  removeEventListeners() {
    this.host.removeEventListener('upos-t-register', this.handleTRegister)
    this.host.removeEventListener('upos-t-unregister', this.handleTUnregister)
  }

  /**
   * Scan and register all existing upos-t elements in light DOM
   * This handles static HTML elements that were already in DOM before event listeners were set
   */
  scanAndRegisterExisting(t: TranslationFunction) {
    const tElements = this.host.querySelectorAll('upos-t')
    tElements.forEach((element) => {
      const component = element as UposT
      if (!this.registeredTElements.has(component)) {
        this.registeredTElements.add(component)
        component.setT(t)
      }
    })
  }

  /**
   * Event handler for upos-t registration
   */
  private handleTRegister(e: Event) {
    const customEvent = e as CustomEvent
    const component = customEvent.detail.component as UposT
    const t = customEvent.detail.t as TranslationFunction | undefined

    // Avoid duplicate registration
    if (!this.registeredTElements.has(component)) {
      this.registeredTElements.add(component)
      if (t) {
        component.setT(t)
      }
    }

    customEvent.stopPropagation()
  }

  /**
   * Event handler for upos-t unregistration
   */
  private handleTUnregister(e: Event) {
    const customEvent = e as CustomEvent
    const component = customEvent.detail.component as UposT
    this.registeredTElements.delete(component)
    customEvent.stopPropagation()
  }

  /**
   * Update all registered upos-t components with new translation function
   */
  updateAllTranslations(t: TranslationFunction) {
    this.registeredTElements.forEach((component) => {
      component.setT(t)
    })
  }

  /**
   * Clear all registered components
   */
  clear() {
    this.registeredTElements.clear()
  }

  /**
   * Get the number of registered components
   */
  get size(): number {
    return this.registeredTElements.size
  }
}
