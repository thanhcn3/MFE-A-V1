import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'lib-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show align-items-center mb-2" 
             [ngClass]="{
               'text-bg-success': toast.type === 'success',
               'text-bg-danger': toast.type === 'error',
               'text-bg-info': toast.type === 'info',
               'text-bg-warning': toast.type === 'warning'
             }"
             role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">
              {{ toast.message }}
            </div>
            <button type="button" class="btn-close me-2 m-auto" 
                    [ngClass]="{'btn-close-white': toast.type !== 'warning'}" 
                    (click)="toastService.remove(toast.id)" aria-label="Close"></button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
