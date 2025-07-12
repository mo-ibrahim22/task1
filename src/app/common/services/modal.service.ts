import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private selectedProductSubject = new BehaviorSubject<Product | null>(null);

  public isOpen$ = this.isOpenSubject.asObservable();
  public selectedProduct$ = this.selectedProductSubject.asObservable();

  openModal(product: Product): void {
    this.selectedProductSubject.next(product);
    this.isOpenSubject.next(true);
  }

  closeModal(): void {
    this.isOpenSubject.next(false);
    this.selectedProductSubject.next(null);
  }

  get isOpen(): boolean {
    return this.isOpenSubject.value;
  }

  get selectedProduct(): Product | null {
    return this.selectedProductSubject.value;
  }
}
