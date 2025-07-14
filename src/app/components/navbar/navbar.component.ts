import { Component, inject } from '@angular/core';
import { LayoutService } from '../../common/services/layout.service';
import { FilterService } from '../../common/services/filter.service';
import { CommonModule } from '@angular/common';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    CartDropdownComponent,
    ClickOutsideDirective,
    ButtonComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  layoutService = inject(LayoutService);
  filterService = inject(FilterService);
  isMobile$ = this.layoutService.isMobile$;
  sidebarOpen$ = this.layoutService.sidebarOpen$;
  showMobileSearch = false;

  toggleMobileSearch() {
    this.showMobileSearch = !this.showMobileSearch;
  }

  closeMobileSearch() {
    this.showMobileSearch = false;
  }

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterService.setSearchTerm(inputElement.value);
  }

  toggleMenu() {
    this.layoutService.toggleSidebar();
  }
}
