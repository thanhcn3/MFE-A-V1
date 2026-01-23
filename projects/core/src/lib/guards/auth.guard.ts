import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import {ToastService} from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (authStore.isAuthenticated()) {
    return true;
  }

  toastService.warning("Thông báo","Vui lòng đăng nhập để truy cập trang này");

  return router.createUrlTree(['/login']);
};
