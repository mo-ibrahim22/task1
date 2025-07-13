import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../common/services/cart.service';
import { CartProduct } from '../../common/models/cart.model';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './cart-dropdown.component.html',
  styleUrl: './cart-dropdown.component.css',
})
export class CartDropdownComponent {
  cartService = inject(CartService);

  cartItems$ = this.cartService.cartItems$;
  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe();
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity).subscribe();
  }

  getTotalPrice(items: CartProduct[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
