import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private channels = new Map<string, BehaviorSubject<unknown>>();

  setData<T>(key: string, payload: T): void {
    console.log("Setting shared data for key:", key, "with payload:", payload);
    this.getChannel<T>(key).next(payload);
  }

  data$<T>(key: string): Observable<T | null> {
    return this.getChannel<T>(key).pipe(distinctUntilChanged());
  }

  peek<T>(key: string): T | null {
    return this.getChannel<T>(key).value as T | null;
  }

  clear(key: string): void {
    const channel = this.channels.get(key);
    if (channel) {
      channel.next(null);
      this.channels.delete(key);
    }
  }

  private getChannel<T>(key: string): BehaviorSubject<T | null> {
    const existing = this.channels.get(key) as BehaviorSubject<T | null> | undefined;
    if (existing) {
      return existing;
    }

    const subject = new BehaviorSubject<T | null>(null);
    // Store as unknown to keep the map covariant across callers
    this.channels.set(key, subject as unknown as BehaviorSubject<unknown>);
    return subject;
  }
}
