import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private isMobileSignal = signal<boolean>(false);
  private sidebarOpenSignal = signal<boolean>(true);

  isMobile = this.isMobileSignal.asReadonly();
  sidebarOpen = this.sidebarOpenSignal.asReadonly();

  checkScreenSize(width: number): void {
    const isMobile = width < 768;
    this.isMobileSignal.set(isMobile);

    // Auto-close sidebar when switching to mobile
    if (isMobile) {
      this.sidebarOpenSignal.set(false);
    } else {
      // Auto-open sidebar when switching to desktop
      this.sidebarOpenSignal.set(true);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpenSignal.set(!this.sidebarOpenSignal());
  }

  closeSidebar(): void {
    this.sidebarOpenSignal.set(false);
  }
}
