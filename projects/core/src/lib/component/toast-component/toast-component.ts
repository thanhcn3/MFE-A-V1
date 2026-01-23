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

  trackById(_index: number, toast: { id: number }): number {
    return toast.id;
  }
}
