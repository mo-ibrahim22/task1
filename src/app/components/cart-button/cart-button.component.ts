import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../common/services/cart.service';
import { Product } from '../../common/models/product.model';

@Component({
  selector: 'app-cart-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-button.component.html',
  styleUrl: './cart-button.component.css',
})
export class CartButtonComponent {
  @Input() product!: Product;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'primary' | 'secondary' = 'primary';

  private cartService = inject(CartService);

  get isInCart(): boolean {
    return this.cartService.isInCart(this.product.id);
  }

  toggleCart(): void {
    if (this.isInCart) {
      this.cartService.removeFromCart(this.product.id).subscribe();
    } else {
      this.cartService.addToCart(this.product).subscribe();
    }
  }

  get buttonText(): string {
    return this.isInCart ? 'Remove from Cart' : 'Add to Cart';
  }

  get buttonClasses(): string {
    const baseClasses =
      'font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const variantClasses = {
      primary: this.isInCart
        ? 'bg-red-500 hover:bg-red-600 text-white'
        : 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: this.isInCart
        ? 'border border-red-500 text-red-500 hover:bg-red-50'
        : 'border border-primary-600 text-primary-600 hover:bg-primary-50',
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${
      variantClasses[this.variant]
    }`;
  }
}
