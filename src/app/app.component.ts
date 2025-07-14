import { Component, OnInit, inject } from '@angular/core';
import { LayoutService } from './common/services/layout.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { ShopComponent } from "./pages/shop/shop.component";
import { SignupComponent } from "./pages/auth/signup/signup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent, ShopComponent, SignupComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private layoutService = inject(LayoutService);

  sidebarOpen$ = this.layoutService.sidebarOpen$;
  isMobile$ = this.layoutService.isMobile$;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.layoutService.checkScreenSize(window.innerWidth);

      window.addEventListener('resize', () => {
        this.layoutService.checkScreenSize(window.innerWidth);
      });
    }
  }
}
