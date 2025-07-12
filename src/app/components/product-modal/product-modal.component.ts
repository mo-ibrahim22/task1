import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../common/services/modal.service';
import { ClickOutsideDirective } from '../../common/directives/click-outside.directive';
import { CartButtonComponent } from '../cart-button/cart-button.component';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective, CartButtonComponent],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
})
export class ProductModalComponent {
  private modalService = inject(ModalService);

  isOpen$ = this.modalService.isOpen$;
  selectedProduct$ = this.modalService.selectedProduct$;

  closeModal(): void {
    this.modalService.closeModal();
  }
}
