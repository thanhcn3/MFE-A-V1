import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const ASSET_PATH = new URL('assets/images/', import.meta.url).href;

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',
})
export class AboutPage {
  storyImage = `${ASSET_PATH}about-story.jpg`;
  teamMembers = [
    {
      name: 'Alice Johnson',
      role: 'Lead Architect',
      image: `${ASSET_PATH}team-alice.jpg`,
      bio: 'Alice has over 10 years of experience in distributed systems.'
    },
    {
      name: 'Bob Smith',
      role: 'Frontend Engineer',
      image: `${ASSET_PATH}team-bob.jpg`,
      bio: 'Bob is passionate about UI/UX and accessible design.'
    },
    {
      name: 'Carol Williams',
      role: 'Product Manager',
      image: `${ASSET_PATH}team-carol.jpg`,
      bio: 'Carol bridges the gap between technical teams and business needs.'
    }
  ];
}
