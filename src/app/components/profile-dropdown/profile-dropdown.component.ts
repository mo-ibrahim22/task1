import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, ButtonComponent],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.css',
})
export class ProfileDropdownComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.user$;
  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.closeDropdown();
  }

  navigateToLogin(): void {
    this.router.navigate(['/signin']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/shop']);
    this.closeDropdown();
  }
}
