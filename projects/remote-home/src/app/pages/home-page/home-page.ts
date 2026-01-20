import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseApiService } from 'core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private apiService = inject(BaseApiService);
  data: any;

  callApi() {
    this.apiService.get('https://jsonplaceholder.typicode.com/todos/1').subscribe((res) => {
      this.data = res;
    });
  }
}
