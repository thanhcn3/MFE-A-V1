
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateService, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from 'core';

@Component({
  selector: 'lib-custom-table-component',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './custom-table-component.html',
  styleUrls: ['./custom-table-component.scss'],
})
export class CustomTableComponent {
  /**
   * Dữ liệu bảng: mỗi phần tử là 1 dòng, key là tên cột
   */
  @Input() data: any[] = [];

  /**
   * i18n: object chứa các label dịch, ví dụ { name: 'Họ tên', email: 'Email', ... }
   */

  originalData: any[] = [];
  sortedData: any[] = [];
  sortKey: string | null = null;
  sortState: 'asc' | 'desc' | 'none' = 'none';

  sortAsc: boolean = true;

  /**
   * Cấu hình cột: [{ key: 'name', label: 'Họ tên' }, ...]
   */
  @Input() columns: { key: string, label: string, sortable?: boolean }[] = [];

  /**
   * Cấu hình action: [{ label: 'Sửa', class: 'edit', onClick: (row) => void }]
   */
  @Input() actions: { label: string, class?: string, icon?: string, onClick: (row: any) => void }[] = [];


  ngOnChanges() {
    this.originalData = [...this.data];
    if (this.sortKey && this.sortState !== 'none') {
      this.applySort();
    } else {
      this.sortedData = [...this.data];
    }
  }

  sortBy(key: string) {
    if (this.sortKey !== key) {
      this.sortKey = key;
      this.sortState = 'asc';
    } else {
      if (this.sortState === 'asc') this.sortState = 'desc';
      else if (this.sortState === 'desc') this.sortState = 'none';
      else this.sortState = 'asc';
    }
    this.applySort();
  }

  applySort() {
    if (!this.sortKey || this.sortState === 'none') {
      this.sortedData = [...this.originalData];
      return;
    }
    const key = this.sortKey;
    const asc = this.sortState === 'asc';
    this.sortedData = [...this.originalData].sort((a, b) => {
      if (a[key] == null) return 1;
      if (b[key] == null) return -1;
      if (typeof a[key] === 'string') {
        return asc ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
      }
      return asc ? a[key] - b[key] : b[key] - a[key];
    });
  }
}
