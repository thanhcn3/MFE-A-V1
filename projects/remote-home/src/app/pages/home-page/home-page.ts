import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {BaseApiService, LanguageService, SharedDataService, createTranslateLoader, ToastService} from 'core';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
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
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  private apiService = inject(BaseApiService);
  // Inject TranslateService and LanguageService via constructor
    constructor(
      private translate: TranslateService,
      private languageService: LanguageService,
      private toastService: ToastService,
      private sharedData: SharedDataService
    ) {}

  private langSub!: Subscription;

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

  data: any;
  heroImage = `url('${ASSET_PATH}home-hero.jpg')`;

  features = [
    {
      title: 'Mirco Frontend',
      description: 'Architecture that splits the frontend into smaller, manageable pieces.',
      image: `${ASSET_PATH}feature-mfe.jpg`
    },
    {
      title: 'Angular',
      description: 'Platform for building mobile and desktop web applications.',
      image: `${ASSET_PATH}feature-angular.jpg`
    },
    {
      title: 'Scalability',
      description: 'Easily scale your development teams and application independently.',
      image: `${ASSET_PATH}feature-scale.jpg`
    }
  ];

  callApi() {
    this.apiService.get('https://jsonplaceholder.typicode.com/todos/1').subscribe((res) => {
      // @ts-ignore
      this.toastService.success("test1","Thanh Công", 200000);
      this.data = res;
    });
  }

  broadcastProfile() {
    const profile = {
      name: 'Thanh',
      role: 'Admin',
      location: 'Ha Noi',
      email: 'thanh@example.com'
    };
    this.sharedData.setData('user-profile', profile);
    this.toastService.info('Share', 'Đã gửi dữ liệu user-profile', 3000);
  }
}
