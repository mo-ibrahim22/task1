import { Component, inject } from '@angular/core';
import { LayoutService } from '../../common/services/layout.service';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private layoutService = inject(LayoutService);

  isMobile$ = this.layoutService.isMobile$;
  sidebarOpen$ = this.layoutService.sidebarOpen$;

  menuItems = [
    {
      label: 'Home',
      href: '#',
      active: false,
      iconPath: 'assets/icons/home.svg',
    },
    {
      label: 'Shop',
      href: '#',
      active: true,
      iconPath: 'assets/icons/shop.svg',
    },
    {
      label: 'About',
      href: '#',
      active: false,
      iconPath: 'assets/icons/about.svg',
    },
    {
      label: 'Contact',
      href: '#',
      active: false,
      iconPath: 'assets/icons/contact.svg',
    },
    {
      label: 'Blog',
      href: '#',
      active: false,
      iconPath: 'assets/icons/blog.svg',
    },
  ];

  toggleMenu() {
    this.layoutService.toggleSidebar();
    console.log(
      'Sidebar toggled. Current state:',
      this.layoutService.sidebarOpen
    );
  }

  onClickOutside() {
    if (this.layoutService.isMobile) {
      this.layoutService.closeSidebar();
    }
  }
}
