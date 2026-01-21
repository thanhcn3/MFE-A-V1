import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http'; 
import { LanguageService, createTranslateLoader } from 'core';
import { Subscription } from 'rxjs';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-about-page',
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
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage implements OnInit, OnDestroy {
  private langSub!: Subscription;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    const currentLang = this.languageService.getCurrentLanguage();
    this.translate.use(currentLang);

    this.langSub = this.languageService.language$.subscribe(lang => {
       this.translate.use(lang);
    });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
  }

  storyImage = `${ASSET_PATH}about-story.jpg`;
  teamMembers = [
    {
      name: 'Alice Johnson',
      role: 'Lead Architect',
      image: `${ASSET_PATH}team-alice.jpg`,
      bio: 'Alice has over 10 years of experience in distributed systems.'
    },
    {
      name: 'Bob Smith',
      role: 'Frontend Engineer',
      image: `${ASSET_PATH}team-bob.jpg`,
      bio: 'Bob is passionate about UI/UX and accessible design.'
    },
    {
      name: 'Carol Williams',
      role: 'Product Manager',
      image: `${ASSET_PATH}team-carol.jpg`,
      bio: 'Carol bridges the gap between technical teams and business needs.'
    }
  ];
}
