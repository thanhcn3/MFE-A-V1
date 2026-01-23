import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthStore, BreadcrumbItem, BreadcrumbService } from 'core';
import { Observable, Subject, filter, takeUntil } from 'rxjs';

type MenuItem = {
  label: string;
  labelKey?: string;
  icon?: string;
  path?: string;
  children?: MenuItem[];
  open?: boolean;
};

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  private authStore = inject(AuthStore);
  readonly apiMenuResponse: { data: MenuItem[] } = {
    data: [
      { label: 'Home', labelKey: 'SIDEBAR.HOME', icon: '', path: '/home' },
      { label: 'About Us', labelKey: 'SIDEBAR.ABOUT', icon: '', path: '/about' },
      {
        label: 'Profile',
        icon: '',
        path: '/profile',
        children: [
          { label: 'Settings', labelKey: 'SIDEBAR.PROFILE_SETTINGS', path: '/profile/settings' },
          { label: 'Notifications', labelKey: 'SIDEBAR.PROFILE_NOTIFICATIONS', path: '/profile/notifications' },
          { label: 'History', labelKey: 'SIDEBAR.PROFILE_HISTORY', path: '/profile/history' }
        ]
      }
    ]
  };

  readonly breadcrumb$: Observable<BreadcrumbItem[]>;
  menuItems: MenuItem[] = this.apiMenuResponse.data.map(item => ({ ...item }));

  private readonly destroyed$ = new Subject<void>();

  constructor(private readonly breadcrumbService: BreadcrumbService, private readonly router: Router) {
    this.breadcrumb$ = this.breadcrumbService.breadcrumb$;
  }

  ngOnInit(): void {
    this.syncBreadcrumbWithUrl(this.router.url);

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroyed$)
      )
      .subscribe((event: NavigationEnd) => {
        this.syncBreadcrumbWithUrl(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }


  toggle(item: MenuItem): void {
    if (!item.children) {
      return;
    }
    this.closeOtherParents(item);
    item.open = !item.open;
  }

  onParentClick(item: MenuItem, event: Event): void {
    this.toggle(item);
    this.setBreadcrumb([{ label: item.label, labelKey: item.labelKey, path: item.path }]);
  }

  onChildClick(parent: MenuItem, child: MenuItem): void {
    this.closeOtherParents(parent);
    this.setBreadcrumb([
      { label: parent.label, labelKey: parent.labelKey, path: parent.path },
      { label: child.label, labelKey: child.labelKey, path: child.path }
    ]);
  }

  onLeafClick(item: MenuItem): void {
    this.closeOtherParents();
    this.setBreadcrumb([{ label: item.label, labelKey: item.labelKey, path: item.path }]);
  }

  private setBreadcrumb(items: BreadcrumbItem[]): void {
    this.breadcrumbService.set(items);
  }

  private syncBreadcrumbWithUrl(url: string): void {
    const cleanUrl = url.split('?')[0];
    this.closeOtherParents();

    for (const item of this.menuItems) {
      if (item.children) {
        const matchedChild = item.children.find(child => child.path === cleanUrl);
        if (matchedChild) {
          this.closeOtherParents(item);
          this.setBreadcrumb([
            { label: item.label, labelKey: item.labelKey, path: item.path },
            { label: matchedChild.label, labelKey: matchedChild.labelKey, path: matchedChild.path }
          ]);
          item.open = true;
          return;
        }
      }

      if (item.path === cleanUrl) {
        this.setBreadcrumb([{ label: item.label, labelKey: item.labelKey, path: item.path }]);
        return;
      }
    }

    const generated = this.buildBreadcrumbFromUrl(cleanUrl);
    this.setBreadcrumb(generated);
  }

  private buildBreadcrumbFromUrl(url: string): BreadcrumbItem[] {
    const segments = url.split('/').filter(Boolean);
    if (segments.length === 0) {
      return [];
    }

    if (segments.length === 1 && segments[0] === 'home') {
      return [{ label: 'Home', path: '/home' }];
    }

    const crumbs: BreadcrumbItem[] = [];
    let acc = '';

    for (const seg of segments) {
      acc += `/${seg}`;
      crumbs.push({ label: this.segmentToLabel(seg), path: acc });
    }

    return crumbs;
  }

  private segmentToLabel(segment: string): string {
    const spaced = segment.replace(/-/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  private closeOtherParents(selected?: MenuItem): void {
    this.menuItems.forEach(menu => {
      if (menu === selected) {
        return;
      }
      if (menu.children) {
        menu.open = false;
      }
    });
  }
  logout(): void {
      this.authStore.logout();
    }
  
}
