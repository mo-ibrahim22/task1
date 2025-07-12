import { Component, Input, inject } from '@angular/core';
import { Product } from '../../common/models/product.model';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../common/services/modal.service';
import { CartButtonComponent } from '../cart-button/cart-button.component';

@Component({
  selector: 'app-item-card',
  imports: [CommonModule, CartButtonComponent],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css',
})
export class ItemCardComponent {
  private modalService = inject(ModalService);

  @Input() product!: Product;
  @Input() first!: boolean;
  @Input() last!: boolean;

  openModal(): void {
    this.modalService.openModal(this.product);
  }
}
