import { Component, Input, inject } from '@angular/core';
import { Product } from '../../common/models/product.model';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../common/services/modal.service';
import { ButtonComponent } from '../ui/button/button.component';
import { CartService } from '../../common/services/cart.service';

@Component({
  selector: 'app-item-card',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
})
export class ItemCardComponent {
  private modalService = inject(ModalService);
  private cartService = inject(CartService);

  @Input() product!: Product;
  @Input() first!: boolean;
  @Input() last!: boolean;

  openModal(): void {
    this.modalService.openModal(this.product);
  }

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

  get cartButtonClass(): string {
    return this.isInCart
      ? 'w-full border border-red-500 text-red-500 hover:bg-red-50'
      : 'w-full border border-primary-600 text-primary-600 hover:bg-primary-50';
  }
}
