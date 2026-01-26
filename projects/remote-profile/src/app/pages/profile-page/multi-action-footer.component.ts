import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core'

@Component({
  selector: 'app-multi-action-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex gap-2 flex-wrap">
      <button type="button" class="btn btn-secondary" (click)="onReject?.()">{{ rejectText }}</button>
      <button type="button" class="btn btn-warning" (click)="onMaybe?.()">{{ maybeText }}</button>
      <button type="button" class="btn btn-primary" (click)="onApprove?.()">{{ approveText }}</button>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiActionFooterComponent {
  @Input() onApprove?: () => void
  @Input() onReject?: () => void
  @Input() onMaybe?: () => void
  @Input() approveText = 'Approve'
  @Input() rejectText = 'Cancel'
  @Input() maybeText = 'Later'
}
