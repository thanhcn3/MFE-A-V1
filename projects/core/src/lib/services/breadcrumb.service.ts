import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BreadcrumbItem {
  label?: string;
  labelKey?: string;
  path?: string;
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly breadcrumbSubject = new BehaviorSubject<BreadcrumbItem[]>([] as BreadcrumbItem[]);

  readonly breadcrumb$: Observable<BreadcrumbItem[]> = this.breadcrumbSubject.asObservable();

  set(items: BreadcrumbItem[]): void {
    if (!items || items.length === 0) {
      this.reset();
      return;
    }
    this.breadcrumbSubject.next(items);
  }

  reset(): void {
    this.breadcrumbSubject.next([] as BreadcrumbItem[]);
  }
}
