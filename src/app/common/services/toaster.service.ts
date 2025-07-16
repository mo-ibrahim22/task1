import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

export interface ConfirmationDialog {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private toastsSignal = signal<ToastMessage[]>([]);
  private confirmationSignal = signal<ConfirmationDialog | null>(null);

  toasts = this.toastsSignal.asReadonly();
  confirmation = this.confirmationSignal.asReadonly();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Toast methods
  showToast(toast: Omit<ToastMessage, 'id'>): void {
    const newToast: ToastMessage = {
      ...toast,
      id: this.generateId(),
      duration: toast.duration ?? 5000,
    };

    this.toastsSignal.update((toasts) => [...toasts, newToast]);

    // Auto remove toast after duration (unless persistent)
    if (!newToast.persistent && (newToast.duration ?? 0) > 0) {
      setTimeout(() => {
        this.removeToast(newToast.id);
      }, newToast.duration ?? 5000);
    }
  }

  success(
    title: string,
    message: string,
    options?: Partial<ToastMessage>
  ): void {
    this.showToast({
      type: 'success',
      title,
      message,
      ...options,
    });
  }

  error(title: string, message: string, options?: Partial<ToastMessage>): void {
    this.showToast({
      type: 'error',
      title,
      message,
      persistent: true, // Errors are persistent by default
      ...options,
    });
  }

  warning(
    title: string,
    message: string,
    options?: Partial<ToastMessage>
  ): void {
    this.showToast({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }

  info(title: string, message: string, options?: Partial<ToastMessage>): void {
    this.showToast({
      type: 'info',
      title,
      message,
      ...options,
    });
  }

  removeToast(id: string): void {
    this.toastsSignal.update((toasts) =>
      toasts.filter((toast) => toast.id !== id)
    );
  }

  clearAllToasts(): void {
    this.toastsSignal.set([]);
  }

  // Confirmation dialog methods
  showConfirmation(confirmation: Omit<ConfirmationDialog, 'id'>): void {
    const newConfirmation: ConfirmationDialog = {
      ...confirmation,
      id: this.generateId(),
      confirmText: confirmation.confirmText ?? 'Confirm',
      cancelText: confirmation.cancelText ?? 'Cancel',
      type: confirmation.type ?? 'info',
    };

    this.confirmationSignal.set(newConfirmation);
  }

  confirm(
    title: string,
    message: string,
    onConfirm?: () => void,
    options?: Partial<ConfirmationDialog>
  ): void {
    this.showConfirmation({
      title,
      message,
      onConfirm,
      type: 'danger',
      ...options,
    });
  }

  closeConfirmation(): void {
    this.confirmationSignal.set(null);
  }

  handleConfirm(): void {
    const confirmation = this.confirmationSignal();
    if (confirmation?.onConfirm) {
      confirmation.onConfirm();
    }
    this.closeConfirmation();
  }

  handleCancel(): void {
    const confirmation = this.confirmationSignal();
    if (confirmation?.onCancel) {
      confirmation.onCancel();
    }
    this.closeConfirmation();
  }
}
