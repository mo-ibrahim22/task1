import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../common/services/modal.service';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';
import { ButtonComponent } from '../button/button.component';
import { CartService } from '../../common/services/cart.service';
import { Product } from '../../common/models/product.model';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, ButtonComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
})
export class ProductModalComponent {
  private readonly modalService = inject(ModalService);
  private readonly cartService = inject(CartService);

  isOpen = this.modalService.isOpen;
  selectedProduct = this.modalService.selectedProduct;

  private isProcessingSignal = signal(false);

  isProcessing = this.isProcessingSignal.asReadonly();
  cartService_public = this.cartService; // Expose for template

  closeModal(): void {
    this.modalService.closeModal();
  }

  isInCart(productId: string): boolean {
    return this.cartService.isInCart(productId);
  }

  getCartItemCount(productId: string): number {
    return this.cartService.getCartItemCount(productId);
  }

  toggleCart(product: Product): void {
    if (this.isProcessingSignal()) {
      return;
    }

    if (this.isInCart(product.id)) {
      // removeItem now shows confirmation dialog
      this.cartService.removeItem(product.id);
    } else {
      this.isProcessingSignal.set(true);
      this.cartService.addToCart(product.id).subscribe({
        next: () => {
          this.isProcessingSignal.set(false);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.isProcessingSignal.set(false);
        },
      });
    }
  }

  updateCartQuantity(product: Product, newQuantity: number): void {
    if (this.isProcessingSignal()) {
      return;
    }

    if (newQuantity <= 0) {
      // When quantity reaches 0, show confirmation before removing
      this.cartService.removeItem(product.id);
    } else {
      this.isProcessingSignal.set(true);
      this.cartService.updateItem(product.id, newQuantity).subscribe({
        next: () => {
          this.isProcessingSignal.set(false);
        },
        error: (err) => {
          console.error('Error updating cart:', err);
          this.isProcessingSignal.set(false);
        },
      });
    }
  }

  getCartButtonClass(product: Product): string {
    const baseClass =
      'w-full font-medium rounded-lg transition-all duration-200';

    if (this.isProcessingSignal()) {
      return `${baseClass} bg-gray-400 text-gray-600 cursor-not-allowed`;
    }

    return this.isInCart(product.id)
      ? `${baseClass} bg-red-500 hover:bg-red-600 text-white`
      : `${baseClass} bg-primary-600 hover:bg-primary-700 text-white`;
  }

  getCartButtonText(product: Product): string {
    if (this.isProcessingSignal()) {
      return this.isInCart(product.id) ? 'Removing...' : 'Adding...';
    }
    return this.isInCart(product.id) ? 'Remove from Cart' : 'Add to Cart';
  }

  getCartButtonIcon(product: Product): string {
    return this.isInCart(product.id)
      ? 'assets/icons/trash.svg'
      : 'assets/icons/shopping-cart.svg';
  }
}
