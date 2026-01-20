import { Injectable, signal, computed, inject } from '@angular/core';
import { BaseApiService } from '../services/base-api.service';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private baseApiService = inject(BaseApiService);
  
  // State
  private _user = signal<{ id?: number; username?: string; token?: string } | null>(this._getUserFromStorage());
  private _loading = signal<boolean>(false);

  private _getUserFromStorage() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    return token ? { username: username || undefined, token } : null;
  }

  // Selectors
  readonly user = this._user.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  // Actions
  login(payload: any) {
    this._loading.set(true);
    return this.baseApiService.post('/api/auth-service/v1/auth/login', payload).pipe(
      tap((response: any) => {
        if (response?.status?.code === 'AUT-0000' && response?.data) {
          const { accessToken, refreshToken } = response.data;
          this._user.set({ username: payload.username, token: accessToken });
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          if (payload.username) localStorage.setItem('username', payload.username);
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  }
}
