import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { LanguageService, SharedDataService, createTranslateLoader, CustomTableComponent } from 'core';
import { Subscription } from 'rxjs';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, TranslateModule, CustomTableComponent],
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
  private profileSub?: Subscription;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private sharedData: SharedDataService
  ) {}

  ngOnInit() {
    // Initial sync
    const currentLang = this.languageService.getCurrentLanguage();
    this.translate.use(currentLang);

    // Subscribe to changes
    this.langSub = this.languageService.language$.subscribe(lang => {
       this.translate.use(lang);
    });

    this.profileSub = this.sharedData.data$<{ name: string; role: string; location?: string; email?: string }>('user-profile')
      .subscribe(profile => {
        if (profile) {
          this.user = {
            ...this.user,
            ...profile,
          };
        }
      });
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }

    if (this.profileSub) {
      this.profileSub.unsubscribe();
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

  tableData = [
    { name: 'Nguyễn Văn A', email: 'a@example.com', active: true },
    { name: 'Trần Thị B', email: 'b@example.com', active: false },
    { name: 'Lê Văn C', email: 'c@example.com', active: true },
  ];

  tableColumns = [
    { key: 'name', label: 'PROFILE.NAME', sortable: true },
    { key: 'email', label: 'PROFILE.EMAIL', sortable: true },
    { key: 'active', label: 'PROFILE.STATUS', sortable: true },
  ];

  tableActions = [
    {
      label: '',
      class: 'edit',
      icon: `${ASSET_PATH}pen-to-square-solid-full.svg`,
      onClick: (row: any) => { alert('Sửa: ' + row.name); }
    },
    {
      label: '',
      class: 'delete',
      icon: `${ASSET_PATH}trash-can-regular-full.svg`,
      onClick: (row: any) => { alert('Xoá: ' + row.name); }
    },
    {
      label: '',
      class: 'view',
      icon: `${ASSET_PATH}view-solid-full.svg`,
      onClick: (row: any) => { alert('Xem: ' + row.name); }
    }
  ];

}
