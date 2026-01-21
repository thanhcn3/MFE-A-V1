import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { LanguageService, createTranslateLoader } from 'core';
import { Subscription } from 'rxjs';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  providers: [
    TranslateService,
    TranslateStore,
    {
      provide: TranslateLoader,
      useFactory: (http: HttpClient) => {
          return createTranslateLoader(http, new URL('../../../assets/i18n/', import.meta.url).href);
      },
      deps: [HttpClient]
    }
  ],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage implements OnInit, OnDestroy {
  private langSub!: Subscription;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    // Initial sync
    const currentLang = this.languageService.getCurrentLanguage();
    this.translate.use(currentLang);

    // Subscribe to changes
    this.langSub = this.languageService.language$.subscribe(lang => {
       this.translate.use(lang);
    });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  user = {
    name: 'John Doe',
    role: 'Senior Developer',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    avatar: `${ASSET_PATH}avatar-john.jpg`,
    stats: {
      projects: 12,
      followers: 1250,
      following: 245
    },
    recentActivities: [
      'Commited to project MFE-A-V1',
      'Reviewed PR #42',
      'Deployed to production'
    ]
  };
}
