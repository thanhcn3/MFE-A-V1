import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
    }
    .nav-pills .nav-link.active, .nav-pills .show>.nav-link {
        background-color: #0d6efd;
    }
    .nav-link {
        color: white;
    }
  `]
})
export class SidebarComponent {}
