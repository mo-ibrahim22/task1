import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  private sidebarOpenSubject = new BehaviorSubject<boolean>(true);

  isMobile$ = this.isMobileSubject.asObservable();
  sidebarOpen$ = this.sidebarOpenSubject.asObservable();

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }

  get sidebarOpen(): boolean {
    return this.sidebarOpenSubject.value;
  }

  checkScreenSize(width: number): void {
    const isMobile = width < 768;
    this.isMobileSubject.next(isMobile);

    // Auto-close on mobile if not already toggled
    if (isMobile && this.sidebarOpen) {
      this.sidebarOpenSubject.next(false);
    }
    // Auto-open on desktop
    else if (!isMobile && !this.sidebarOpen) {
      this.sidebarOpenSubject.next(true);
    }
  }

  toggleSidebar(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  closeSidebar(): void {
    if (this.isMobile) {
      this.sidebarOpenSubject.next(false);
    }
  }
}
