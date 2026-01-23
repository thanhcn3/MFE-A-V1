import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStore, ToastService } from 'core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss']
})
export class LoginPage {
  username = '';
  password = '';

  private authStore = inject(AuthStore);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = this.authStore.isLoading;

  login() {
    if (this.username && this.password) {
      const payload = {
        username: this.username,
        password: this.password
      };

      this.authStore.login(payload).subscribe({
        next: () => {
          this.toastService.success('Login','Login successfully!', 2000);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed full error:', err);
          if (err.status === 404) {
             this.toastService.error('Login fail','Error 404: API endpoint not found. Please check Proxy settings or Backend URL.');
          } else {
             this.toastService.error('Login fail',`Login failed! Error ${err.status}: ${err.message}`);
          }
        }
      });
    } else {
      this.toastService.warning('Login','Please enter username and password');
    }
  }
}
