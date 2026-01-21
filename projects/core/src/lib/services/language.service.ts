import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('vi'); // Default to Vietnamese
  public language$ = this.languageSubject.asObservable();

  constructor() { }

  setLanguage(lang: string) {
    this.languageSubject.next(lang);
  }

  getCurrentLanguage(): string {
    return this.languageSubject.value;
  }
}
