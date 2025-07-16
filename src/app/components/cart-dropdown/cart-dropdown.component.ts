import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../common/services/cart.service';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, ButtonComponent],
  templateUrl: './cart-dropdown.component.html',
  styleUrl: './cart-dropdown.component.css',
})
export class CartDropdownComponent implements OnInit {
  cartService = inject(CartService);
  cart = this.cartService.cart;

  isOpen = signal(false);
  processingItems = signal<Set<string>>(new Set());

  ngOnInit(): void {
    // Load cart when the component initializes
    this.cartService.getCart().subscribe();
  }

  toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  isProcessingItem(productId: string): boolean {
    return this.processingItems().has(productId);
  }

  private setProcessingItem(productId: string, processing: boolean): void {
    const current = new Set(this.processingItems());
    if (processing) {
      current.add(productId);
    } else {
      current.delete(productId);
    }
    this.processingItems.set(current);
  }

  removeFromCart(productId: string): void {
    if (this.isProcessingItem(productId)) {
      return;
    }

    this.setProcessingItem(productId, true);

    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.setProcessingItem(productId, false);
      },
      error: (error) => {
        console.error('Error removing from cart:', error);
        this.setProcessingItem(productId, false);
      },
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (this.isProcessingItem(productId)) {
      return;
    }

    this.setProcessingItem(productId, true);

    if (quantity <= 0) {
      this.cartService.removeItem(productId).subscribe({
        next: () => {
          this.setProcessingItem(productId, false);
        },
        error: (error) => {
          console.error('Error removing from cart:', error);
          this.setProcessingItem(productId, false);
        },
      });
    } else {
      this.cartService.updateItem(productId, quantity).subscribe({
        next: () => {
          this.setProcessingItem(productId, false);
        },
        error: (error) => {
          console.error('Error updating cart:', error);
          this.setProcessingItem(productId, false);
        },
      });
    }
  }

  getTotalPrice(): number {
    return this.cartService.totalPrice();
  }
}
