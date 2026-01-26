import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

export interface FooterModalProps {
  onOk?: () => void
  onClose?: () => void
  okLabel?: string
  closeLabel?: string
  disableOk?: boolean
}

@Component({
  selector: 'core-footer-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="btn btn-secondary" (click)="handleClose()">
      {{ closeText }}
    </button>
    <button
      type="button"
      class="btn btn-primary"
      [disabled]="footerProps?.disableOk"
      (click)="handleOk()"
    >
      {{ okText }}
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterModalComponent {
  @Input() footerProps: FooterModalProps | null = null

  constructor(private translate: TranslateService) {}

  get okText(): string {
    return this.footerProps?.okLabel || this.translate.instant('common.ok')
  }

  get closeText(): string {
    return this.footerProps?.closeLabel || this.translate.instant('common.cancel')
  }

  handleOk() {
    this.footerProps?.onOk?.()
  }

  handleClose() {
    this.footerProps?.onClose?.()
  }
}
