import {Component, inject} from '@angular/core';
import {ToastService} from 'core';
import {NgClass, NgSwitch, NgSwitchCase, NgIf} from '@angular/common';

@Component({
  selector: 'lib-toast-component',
  imports: [
    NgClass,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './toast-component.html',
  styleUrl: './toast-component.scss',
})
export class ToastComponent {
  toastService = inject(ToastService);
}
