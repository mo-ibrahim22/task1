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

  removeFromCart(productId: string): void {
    this.cartService.removeItem(productId).subscribe();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.cartService.updateItem(productId, quantity).subscribe();
    }
  }

  getTotalPrice(): number {
    return this.cartService.totalPrice();
  }
}
