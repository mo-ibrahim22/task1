import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ShopComponent } from './pages/shop/shop.component';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent, NavbarComponent, ShopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'task1';
  searchTerm = '';
  sidebarOpen = false;
  isMobile = false;

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  onMenuStateChange(state: { isOpen: boolean; isMobile: boolean }) {
    this.sidebarOpen = state.isOpen;
    this.isMobile = state.isMobile;
  }
}
