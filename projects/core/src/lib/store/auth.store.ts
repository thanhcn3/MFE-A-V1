import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  // State
  private _user = signal<{ id: number; name: string; email: string } | null>(null);
  private _loading = signal<boolean>(false);

  // Selectors
  readonly user = this._user.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._user());

  // Actions
  login(username: string) {
    this._loading.set(true);
    // Simulate API call
    setTimeout(() => {
      this._user.set({ id: 1, name: username, email: `${username}@example.com` });
      this._loading.set(false);
    }, 1000);
  }

  logout() {
    this._user.set(null);
  }
}
