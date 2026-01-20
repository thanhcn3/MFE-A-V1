import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  template: `
    <header class="bg-white shadow-sm p-3 mb-4 d-flex justify-content-between align-items-center">
      <h1 class="h5 m-0 text-dark">Dashboard</h1>
      <span class="badge bg-primary rounded-pill">Admin</span>
    </header>
  `
})
export class TopbarComponent {}
