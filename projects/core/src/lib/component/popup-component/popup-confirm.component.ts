import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'core-popup-confirm',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <ng-container *ngIf="content.length; else defaultContent">
      <p class="mb-2" *ngFor="let line of content">{{ line }}</p>
    </ng-container>
    <ng-template #defaultContent>
      <p class="mb-0">{{ defaultMessage }}</p>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupConfirmComponent {
  @Input() content: string[] = []

  constructor(private translate: TranslateService) {}

  get defaultMessage(): string {
    return this.translate.instant('common.areYouSure')
  }
}
