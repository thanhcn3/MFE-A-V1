import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseApiService } from 'core';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private apiService = inject(BaseApiService);
  data: any;

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
      this.data = res;
    });
  }
}
