import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
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
}
