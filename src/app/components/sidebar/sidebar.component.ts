import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {

@Output() menuStateChange = new EventEmitter<{ isOpen: boolean, isMobile: boolean }>();
  isMenuOpen = false;
  isMobile = false;

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


  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.menuStateChange.emit({ isOpen: this.isMenuOpen, isMobile: this.isMobile });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuStateChange.emit({ isOpen: this.isMenuOpen, isMobile: this.isMobile });
  }
}