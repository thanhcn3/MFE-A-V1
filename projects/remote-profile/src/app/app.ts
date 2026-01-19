import { Component, signal } from '@angular/core';
import { ProfilePage } from './pages/profile-page/profile-page';

@Component({
  selector: 'app-root',
  imports: [ProfilePage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('remote-profile');
}
