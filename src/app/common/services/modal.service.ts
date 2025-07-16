import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isOpenSignal = signal<boolean>(false);
  private selectedProductSignal = signal<Product | null>(null);

  isOpen = this.isOpenSignal.asReadonly();
  selectedProduct = this.selectedProductSignal.asReadonly();

  openModal(product: Product): void {
    this.selectedProductSignal.set(product);
    this.isOpenSignal.set(true);
  }

  closeModal(): void {
    this.isOpenSignal.set(false);
    this.selectedProductSignal.set(null);
  }
}
