import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.user;

  ngOnInit(): void {
    // Redirect to login if not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/shop']);
  }

  goBack(): void {
    this.router.navigate(['/shop']);
  }
}
