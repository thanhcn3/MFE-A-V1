import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Type,
  ViewEncapsulation,
} from '@angular/core'
import { NgComponentOutlet } from '@angular/common'

@Component({
  selector: 'core-modal-footer-host',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    <ng-container
      *ngComponentOutlet="footerComponent; inputs: footerProps"
    ></ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input() footerComponent: Type<unknown> | null = null
  @Input() footerProps: Record<string, unknown> | undefined
}
