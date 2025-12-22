import type { UposButton } from '../ui/upos-button'

/**
 * Manages slot content checking and updates
 */
export class SlotManager {
  constructor(private host: HTMLElement) {}

  /**
   * Check if a slot has content in the light DOM
   */
  hasContent(slotName: string): boolean {
    return !!this.host.querySelector(`[slot="${slotName}"]`)
  }

  /**
   * Check if custom method selector slot has content
   */
  checkCustomMethodSelector(shadowRoot: ShadowRoot | null): boolean {
    if (!shadowRoot) { return false }

    const slot = shadowRoot.querySelector('slot[name="method-selector-override"]') as HTMLSlotElement
    if (slot) {
      return slot.assignedElements().length > 0
    }
    return false
  }

  /**
   * Update slotted submit button state (loading/disabled)
   */
  updateSlotButton(submitButtonSlot: HTMLSlotElement | undefined, isSubmitting: boolean) {
    if (!submitButtonSlot) { return }

    const assignedElements = submitButtonSlot.assignedElements()
    assignedElements.forEach((el) => {
      if (el.tagName === 'UPOS-BUTTON') {
        const button = el as UposButton
        button.loading = isSubmitting
        button.disabled = isSubmitting
      } else if (el.tagName === 'BUTTON') {
        const button = el as HTMLButtonElement
        button.disabled = isSubmitting
      }
    })
  }
}
