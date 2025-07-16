import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ToasterService,
  ToastMessage,
  ConfirmationDialog,
} from '../../common/services/toaster.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private toasterService = inject(ToasterService);

  @ViewChild('toastTemplate', { static: true })
  toastTemplate!: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true })
  confirmationTemplate!: TemplateRef<any>;

  toasts = this.toasterService.toasts;
  confirmation = this.toasterService.confirmation;

  removeToast(id: string): void {
    this.toasterService.removeToast(id);
  }

  clearAllToasts(): void {
    this.toasterService.clearAllToasts();
  }

  handleConfirm(): void {
    this.toasterService.handleConfirm();
  }

  handleCancel(): void {
    this.toasterService.handleCancel();
  }

  getToastIcon(type: ToastMessage['type']): string {
    const icons = {
      success: 'assets/icons/check-circle.svg',
      error: 'assets/icons/error.svg',
      warning: 'assets/icons/warning.svg',
      info: 'assets/icons/info.svg',
    };
    return icons[type];
  }

  getToastClasses(type: ToastMessage['type']): string {
    const baseClasses =
      'flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform';
    const typeClasses = {
      success: 'bg-green-50 border-green-500 text-green-800',
      error: 'bg-red-50 border-red-500 text-red-800',
      warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
      info: 'bg-blue-50 border-blue-500 text-blue-800',
    };
    return `${baseClasses} ${typeClasses[type]}`;
  }

  getConfirmationClasses(type: ConfirmationDialog['type']): string {
    const typeClasses = {
      danger: 'text-red-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
    };
    return typeClasses[type || 'info'];
  }

  getConfirmButtonClasses(type: ConfirmationDialog['type']): string {
    const typeClasses = {
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      info: 'bg-blue-600 hover:bg-blue-700 text-white',
    };
    return typeClasses[type || 'info'];
  }
}
