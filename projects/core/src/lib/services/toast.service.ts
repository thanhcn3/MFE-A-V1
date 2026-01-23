import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private currentId = 0;
  private _toasts = signal<Toast[]>([]);

  readonly toasts = this._toasts.asReadonly();

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000, title?: string) {
    const id = this.currentId++;
    const toast: Toast = { id, message, type, duration, title };
    this._toasts.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(title: string, message: string, duration?: number) {
    this.show(message, 'success', duration, title);
  }

  error(title: string, message: string, duration?: number) {
    this.show(message, 'error', duration, title);
  }

  info(title: string, message: string, duration?: number) {
    this.show(message, 'info', duration, title);
  }

  warning(title: string, message: string, duration?: number) {
    this.show(message, 'warning', duration, title);
  }

  remove(id: number) {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
