import { Injectable, computed, signal } from '@angular/core';

/**
 * Global loading manager that supports multiple concurrent loading keys.
 * Each `start(key)` increments a counter; `stop(key)` decrements it.
 * `isLoading()` reports true if any key has a positive counter.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _loadingMap = signal<Map<string, number>>(new Map());

  /** True when any loading key is active. */
  readonly isLoading = computed(() => {
    const map = this._loadingMap();
    for (const count of map.values()) {
      if (count > 0) return true;
    }
    return false;
  });

  /** Returns true when the given key is active. */
  isLoadingKey(key: string): boolean {
    const count = this._loadingMap().get(key) ?? 0;
    return count > 0;
  }

  /** Start loading for a key (default: "global"). Returns a stop handle. */
  start(key: string = 'global'): () => void {
    this.bump(key, +1);
    return () => this.stop(key);
  }

  /** Stop loading for a key (no-op if already zero). */
  stop(key: string = 'global'): void {
    this.bump(key, -1);
  }

  /** Clear all loading states. */
  reset(): void {
    this._loadingMap.set(new Map());
  }

  private bump(key: string, delta: number): void {
    this._loadingMap.update((prev) => {
      const next = new Map(prev);
      const current = next.get(key) ?? 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        next.delete(key);
      } else {
        next.set(key, updated);
      }
      return next;
    });
  }
}
