import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, CustomTableComponent, InputComponent, LanguageService, ModalService, PopupConfirmComponent, SharedDataService, createTranslateLoader } from 'core';
import { MultiActionFooterComponent } from './multi-action-footer.component';
import { Subscription } from 'rxjs';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CustomTableComponent, InputComponent, ButtonComponent],
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

  profileForm: FormGroup;
  statusOptions: { label: string; value: string }[] = [];
  saving = false;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private sharedData: SharedDataService,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      fullName: [''],
      role: [''],
      location: [''],
      status: ['active'],
    });
  }

  ngOnInit() {
    // Initial sync
    const currentLang = this.languageService.getCurrentLanguage();
    this.translate.use(currentLang);

    // Subscribe to changes
     this.langSub = this.languageService.language$.subscribe(lang => {
       this.translate.use(lang);
       this.updateStatusOptions();
     });

    this.profileSub = this.sharedData.data$<{ name: string; role: string; location?: string; email?: string }>('user-profile')
      .subscribe(profile => {
        if (profile) {
          this.user = {
            ...this.user,
            ...profile,
          };

          this.profileForm.patchValue({
            fullName: this.user.name,
            role: this.user.role,
            location: this.user.location,
            status: this.user.status,
          });
        }
      });

    this.profileForm.patchValue({
      fullName: this.user.name,
      role: this.user.role,
      location: this.user.location,
    });

    this.updateStatusOptions();
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
    status: 'active',
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
      onClick: (row: any) => { this.deleteRow(row); }
    },
    {
      label: '',
      class: 'view',
      icon: `${ASSET_PATH}view-solid-full.svg`,
      onClick: (row: any) => { this.openMultiActionConfirm(row); }
    }
  ];


  openMultiActionConfirm(row: any) {
    const content = [
      this.translate.instant('PROFILE.MULTI_CONFIRM_LINE1', { name: row.name }),
      this.translate.instant('PROFILE.MULTI_CONFIRM_LINE2'),
    ]

    const idModalConfirm = this.modalService.showModal(
      this.translate.instant('PROFILE.MULTI_CONFIRM_TITLE'),
      PopupConfirmComponent,
      { content },
      MultiActionFooterComponent,
      {
        onApprove: () => console.log('Approve', row.name),
        onMaybe: () => console.log('Maybe later', row.name),
        onReject: () => console.log('Reject', row.name),
      },
      { width: '920px' }
    )
  }

  deleteRow(row: any) {
    this.tableData = this.tableData.filter((item) => item !== row)
  }

  closeModal(modalId: string) {
    this.modalService.hideModal(modalId)
  }

  private updateStatusOptions(): void {
    this.statusOptions = [
      { label: this.translate.instant('PROFILE.STATUS_ACTIVE') || 'Active', value: 'active' },
      { label: this.translate.instant('PROFILE.STATUS_PAUSED') || 'Paused', value: 'paused' },
      { label: this.translate.instant('PROFILE.STATUS_INACTIVE') || 'Inactive', value: 'inactive' },
    ];
  }

  submitProfile(): void {
    if (this.profileForm.invalid) return;
    this.saving = true;
    const payload = this.profileForm.value;
    console.log('Save profile', payload);
    setTimeout(() => {
      this.user = {
        ...this.user,
        name: payload.fullName || this.user.name,
        role: payload.role || this.user.role,
        location: payload.location || this.user.location,
        status: payload.status || this.user.status,
      };
      this.saving = false;
    }, 800);
  }

  resetForm(): void {
    this.profileForm.reset({
      fullName: this.user.name,
      role: this.user.role,
      location: this.user.location,
      status: this.user.status,
    });
  }

}
