import { Component, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ToastService } from 'core';

@Component({
  selector: 'lib-toast-component',
  imports: [CommonModule, NgClass],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.scss',
})
export class ToastComponent {
  toastService = inject(ToastService);

  private readonly icons = {
    success: new URL('../../assets/icons/toast-success.svg', import.meta.url).toString(),
    error: new URL('../../assets/icons/toast-error.svg', import.meta.url).toString(),
    info: new URL('../../assets/icons/toast-info.svg', import.meta.url).toString(),
    warning: new URL('../../assets/icons/toast-warning.svg', import.meta.url).toString(),
  } as const;

  readonly closeIcon = new URL('../../assets/icons/toast-close.svg', import.meta.url).toString();

  trackById(_index: number, toast: { id: number }): number {
    return toast.id;
  }

  getIcon(type: string): string {
    return this.icons[type as keyof typeof this.icons] ?? this.icons.info;
  }
}
