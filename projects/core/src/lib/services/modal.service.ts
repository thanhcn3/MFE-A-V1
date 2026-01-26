import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Type,
  createComponent,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { FooterComponent } from '../component/popup-component/footer.component'
import { FooterModalComponent, FooterModalProps } from '../component/popup-component/footer-modal.component'
import { PopupConfirmComponent } from '../component/popup-component/popup-confirm.component'


export interface ModalInstance {
  element: HTMLElement
  instance: any
  id: string
  footerRef?: ComponentRef<FooterComponent> | null
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: ModalInstance[] = []
  private modalIdCounter = 0

  constructor(
    private appRef: ApplicationRef,
    private translate: TranslateService,
    private environmentInjector: EnvironmentInjector
  ) {}

  /**
   * Check if Bootstrap is loaded
   */
  private isBootstrapLoaded(): boolean {
    return (
      typeof (window as any).bootstrap !== 'undefined' &&
      typeof (window as any).bootstrap.Modal !== 'undefined'
    )
  }

  /**
   * Generate unique modal ID
   */
  private generateModalId(): string {
    return `modal-${++this.modalIdCounter}-${Date.now()}`
  }

  /**
   * Show a Bootstrap modal dynamically with optional footer
   * Returns modal ID for later reference
   */
  showModal<C>(
    title: string,
    contentComponent: Type<C>,
    contentData: Partial<C> = {},
    footerComponent?: Type<unknown>,
    footerProps: Record<string, unknown> = {},
    modalOptions: Partial<{ width: string }> = {}
  ): string {
    if (!this.isBootstrapLoaded()) {
      console.error('Bootstrap JavaScript is required for ModalService.')
      return ''
    }

    const modalId = this.generateModalId()

    // Create modal wrapper
    const modalDiv = document.createElement('div')
    modalDiv.classList.add('modal', 'fade')
    modalDiv.tabIndex = -1
    modalDiv.setAttribute('role', 'dialog')
    modalDiv.setAttribute('aria-hidden', 'true')
    modalDiv.setAttribute('data-modal-id', modalId)
    modalDiv.innerHTML = `
  <div class="modal-dialog modal-dialog-centered"
       style="max-width:${modalOptions.width || '600px'}; width:${modalOptions.width || '600px'};">
    <div class="modal-content" style="max-height: 85vh; display: flex; flex-direction: column;">
      <div class="modal-header" style="flex-shrink: 0;">
        <h6 class="modal-title">
          ${this.upperCase(this.translate.instant(title))}
        </h6>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" style="overflow-y: auto; flex: 1 1 auto;"></div>
      <div class="modal-footer" style="flex-shrink: 0;"></div>
    </div>
  </div>
`
    document.body.appendChild(modalDiv)

    const bodyEl = modalDiv.querySelector('.modal-body')!
    const footerEl = modalDiv.querySelector('.modal-footer')!

    // Attach content component dynamically
    const contentRef: ComponentRef<C> = createComponent(contentComponent, {
      environmentInjector: this.environmentInjector,
    })
    Object.assign(contentRef.instance as any, { ...contentData, modalId })
    this.appRef.attachView(contentRef.hostView)
    bodyEl.appendChild(contentRef.location.nativeElement)

    // Initialize Bootstrap modal
    const bootstrapModal = new (window as any).bootstrap.Modal(modalDiv, {
      backdrop: 'static',
      keyboard: false,
    })

    // Attach footer component if provided
    let footerRef: ComponentRef<FooterComponent> | null = null
    if (footerComponent) {
      footerRef = createComponent(FooterComponent, {
        environmentInjector: this.environmentInjector,
      })
      footerRef.instance.footerComponent = footerComponent

      // Wrap callbacks to auto-hide modal
      const wrappedProps = { ...footerProps } as any
      if (wrappedProps.onOk) {
        const originalOnOk = wrappedProps.onOk
        wrappedProps.onOk = () => {
          originalOnOk()
          this.hideModal(modalId)
        }
      }
      if (wrappedProps.onClose) {
        const originalOnClose = wrappedProps.onClose
        wrappedProps.onClose = () => {
          originalOnClose()
          this.hideModal(modalId)
        }
      }

      footerRef.instance.footerProps = wrappedProps
      this.appRef.attachView(footerRef.hostView)
      footerEl.appendChild(footerRef.location.nativeElement)
      footerRef.changeDetectorRef.detectChanges()
    }

    // Track modal
    this.modals.push({
      element: modalDiv,
      instance: bootstrapModal,
      id: modalId,
      footerRef,
    })

    // Show modal
    bootstrapModal.show()

    // Cleanup after modal hide
    modalDiv.addEventListener('hidden.bs.modal', () => {
      this.appRef.detachView(contentRef.hostView)
      contentRef.destroy()
      if (footerRef) {
        this.appRef.detachView(footerRef.hostView)
        footerRef.destroy()
      }
      modalDiv.remove()
      this.modals = this.modals.filter((m) => m.id !== modalId)
    })

    return modalId
  }

  /**
   * Hide a specific modal by ID
   */
  hideModal(modalId: string) {
    const modal = this.modals.find((m) => m.id === modalId)
    if (modal) {
      modal.instance?.hide()
    }
  }

  /**
   * Hide the most recently opened modal
   */
  hideCurrent() {
    if (this.modals.length > 0) {
      const lastModal = this.modals[this.modals.length - 1]
      this.hideModal(lastModal.id)
    }
  }

  /**
   * Hide all modals
   */
  hideAll() {
    this.modals.forEach(({ instance }) => {
      instance?.hide()
    })
  }

  /**
   * Get the ID of the most recently opened modal
   */
  getCurrentModalId(): string | null {
    if (this.modals.length > 0) {
      return this.modals[this.modals.length - 1].id
    }
    return null
  }

  upperCase(str: string) {
    return str.toUpperCase()
  }

  updateFooterProps(modalId: string, props: Partial<FooterModalProps>) {
    const modal = this.modals.find((m) => m.id === modalId)
    if (!modal?.footerRef) return

    modal.footerRef.instance.footerProps = {
      ...(modal.footerRef.instance.footerProps || {}),
      ...props,
    }
    modal.footerRef.changeDetectorRef.markForCheck()
    modal.footerRef.changeDetectorRef.detectChanges()
  }
}
