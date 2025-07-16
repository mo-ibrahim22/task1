import { Component, input, inject, signal } from '@angular/core';
import { Product } from '../../common/models/product.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../common/services/modal.service';
import { ButtonComponent } from '../button/button.component';
import { CartService } from '../../common/services/cart.service';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
})
export class ItemCardComponent {
  private readonly modalService = inject(ModalService);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  product = input.required<Product>();
  first = input.required<boolean>();
  last = input.required<boolean>();

  private isProcessingSignal = signal(false);

  isProcessing = this.isProcessingSignal.asReadonly();
  cartService_public = this.cartService; // Expose for template

  openModal(): void {
    this.router.navigate(['/product', this.product().id]);
  }

  get isInCart(): boolean {
    return this.cartService.isInCart(this.product().id);
  }

  get cartItemCount(): number {
    return this.cartService.getCartItemCount(this.product().id);
  }

  toggleCart(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    if (this.isProcessingSignal()) {
      return; // Prevent multiple clicks
    }

    if (this.isInCart) {
      // removeItem now shows confirmation dialog, no need to handle loading state here
      this.cartService.removeItem(this.product().id);
    } else {
      this.isProcessingSignal.set(true);
      this.cartService.addToCart(this.product().id).subscribe({
        next: () => {
          this.isProcessingSignal.set(false);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          this.isProcessingSignal.set(false);
        },
      });
    }
  }

  get cartButtonClass(): string {
    const baseClass = 'w-full font-medium transition-all duration-200';

    if (this.isProcessingSignal()) {
      return `${baseClass} bg-gray-400 text-gray-600 cursor-not-allowed`;
    }

    return this.isInCart
      ? `${baseClass} border border-red-500 text-red-500 hover:bg-red-50`
      : `${baseClass} border border-primary-600 text-primary-600 hover:bg-primary-50`;
  }

  get cartButtonText(): string {
    if (this.isProcessingSignal()) {
      return this.isInCart ? 'Removing...' : 'Adding...';
    }
    return this.isInCart ? 'Remove' : 'Add';
  }

  get cartButtonIcon(): string {
    return this.isInCart
      ? 'assets/icons/trash.svg'
      : 'assets/icons/shopping-cart.svg';
  }
}
