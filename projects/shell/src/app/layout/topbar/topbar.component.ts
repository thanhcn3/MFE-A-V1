import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  currentLang = 'vi';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.language$.subscribe(lang => {
      this.currentLang = lang;
      this.translate.use(lang);
    });
  }

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
