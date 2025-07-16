import { Component, input, inject } from '@angular/core';
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

  openModal(): void {
    this.router.navigate(['/product', this.product().id]);
  }

  get isInCart(): boolean {
    return this.cartService.isInCart(this.product().id);
  }

  toggleCart(): void {
    if (this.isInCart) {
      this.cartService.removeItem(this.product().id).subscribe(() => {
        this.cartService.getCart().subscribe(); // refresh cache
      });
    } else {
      this.cartService.addToCart(this.product().id).subscribe(() => {
        this.cartService.getCart().subscribe(); // refresh cache
      });
    }
  }

  get cartButtonClass(): string {
    return this.isInCart
      ? 'w-full border border-red-500 text-red-500 hover:bg-red-50'
      : 'w-full border border-primary-600 text-primary-600 hover:bg-primary-50';
  }
}
