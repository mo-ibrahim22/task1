import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../common/services/modal.service';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';
import { ButtonComponent } from '../button/button.component';
import { CartService } from '../../common/services/cart.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, ButtonComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
})
export class ProductModalComponent {
  private modalService = inject(ModalService);
  private cartService = inject(CartService);

  isOpen$ = this.modalService.isOpen$;
  selectedProduct$ = this.modalService.selectedProduct$;

  closeModal(): void {
    this.modalService.closeModal();
  }

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  toggleCart(product: any): void {
    if (this.isInCart(product.id)) {
      this.cartService.removeFromCart(product.id).subscribe();
    } else {
      this.cartService.addToCart(product).subscribe();
    }
  }

  getCartButtonClass(product: any): string {
    return this.isInCart(product.id)
      ? 'w-full bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-200'
      : 'w-full bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all duration-200';
  }
}
