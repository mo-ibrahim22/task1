import { Component, OnInit, inject, effect } from '@angular/core';
import { LayoutService } from './common/services/layout.service';
import { AuthService } from './common/services/auth.service';
import { CartService } from './common/services/cart.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  sidebarOpen = this.layoutService.sidebarOpen;
  isMobile = this.layoutService.isMobile;

  constructor() {
    // Initialize cart when user changes
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.cartService.initializeCart();
      }
    });
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.layoutService.checkScreenSize(window.innerWidth);

      window.addEventListener('resize', () => {
        this.layoutService.checkScreenSize(window.innerWidth);
      });
    }
  }
}
