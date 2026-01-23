import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbItem, BreadcrumbService, LanguageService } from 'core';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit, OnDestroy {
  currentLang = 'vi';
  readonly breadcrumb$: Observable<BreadcrumbItem[]>;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.breadcrumb$ = this.breadcrumbService.breadcrumb$;
  }

  ngOnInit() {
    this.languageService.language$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(lang => {
        this.currentLang = lang;
        this.translate.use(lang);
      });
  }

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
