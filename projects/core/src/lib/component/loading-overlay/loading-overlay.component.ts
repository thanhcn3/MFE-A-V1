import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'core-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingOverlayComponent {
  private readonly loading = inject(LoadingService);

  /**
   * Optional loading key to scope the overlay. When omitted, uses global state.
   */
  @Input() key?: string;

  /** Optional text to show under the spinner. */
  @Input() message = 'Loading...';

  /** Render as full-screen overlay when true; otherwise fills parent container. */
  @Input() fullscreen = true;

  readonly active = computed(() => {
    return this.key ? this.loading.isLoadingKey(this.key) : this.loading.isLoading();
  });
}
