import { Component, signal } from '@angular/core';
import { AboutPage } from './pages/about-page/about-page';

@Component({
  selector: 'app-root',
  imports: [AboutPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('remote-about');
}
