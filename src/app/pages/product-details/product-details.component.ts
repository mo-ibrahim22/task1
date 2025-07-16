import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../common/services/products.service';
import { CartService } from '../../common/services/cart.service';
import { Product } from '../../common/models/product.model';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  selectedImageIndex = signal(0);
  error = signal<string | null>(null);
  isProcessingCart = signal(false);

  // Expose cart service for template
  cartService_public = this.cartService;

  constructor() {
    // React to route parameter changes
    effect(() => {
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error.set('No product ID provided');
      this.isLoading.set(false);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productsService.getProductById(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.product.set(response.data);
          this.selectedImageIndex.set(0); // Reset image selection
        } else {
          this.error.set('Product data not found');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error.set('Failed to load product. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  selectImage(index: number): void {
    const currentProduct = this.product();
    if (currentProduct && index >= 0 && index < currentProduct.images.length) {
      this.selectedImageIndex.set(index);
    }
  }

  isInCart(): boolean {
    const currentProduct = this.product();
    return currentProduct
      ? this.cartService.isInCart(currentProduct.id)
      : false;
  }

  getCartItemCount(): number {
    const currentProduct = this.product();
    return currentProduct
      ? this.cartService.getCartItemCount(currentProduct.id)
      : 0;
  }

  toggleCart(): void {
    const currentProduct = this.product();
    if (!currentProduct || this.isProcessingCart()) {
      return;
    }

    if (this.isInCart()) {
      // removeItem now shows confirmation dialog
      this.cartService.removeItem(currentProduct.id);
    } else {
      this.isProcessingCart.set(true);
      this.cartService.addToCart(currentProduct.id).subscribe({
        next: () => {
          this.isProcessingCart.set(false);
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
          this.isProcessingCart.set(false);
        },
      });
    }
  }

  updateCartQuantity(newQuantity: number): void {
    const currentProduct = this.product();
    if (!currentProduct || this.isProcessingCart()) {
      return;
    }

    if (newQuantity <= 0) {
      // When quantity reaches 0, show confirmation before removing
      this.cartService.removeItem(currentProduct.id);
    } else {
      this.isProcessingCart.set(true);
      this.cartService.updateItem(currentProduct.id, newQuantity).subscribe({
        next: () => {
          this.isProcessingCart.set(false);
        },
        error: (err) => {
          console.error('Error updating cart:', err);
          this.isProcessingCart.set(false);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/shop']);
  }

  get cartButtonClass(): string {
    const baseClass =
      'w-full font-semibold py-4 rounded-xl transition-all duration-200';

    if (this.isProcessingCart()) {
      return `${baseClass} bg-gray-400 text-gray-600 cursor-not-allowed`;
    }

    return this.isInCart()
      ? `${baseClass} bg-red-500 hover:bg-red-600 text-white`
      : `${baseClass} bg-primary-600 hover:bg-primary-700 text-white`;
  }

  get cartButtonText(): string {
    if (this.isProcessingCart()) {
      return this.isInCart() ? 'Removing...' : 'Adding...';
    }
    return this.isInCart() ? 'Remove from Cart' : 'Add to Cart';
  }

  get cartButtonIcon(): string {
    return this.isInCart()
      ? 'assets/icons/trash.svg'
      : 'assets/icons/shopping-cart.svg';
  }

  get currentImage(): string {
    const currentProduct = this.product();
    if (!currentProduct) return '';

    if (currentProduct.images && currentProduct.images.length > 0) {
      const index = this.selectedImageIndex();
      return currentProduct.images[index] || currentProduct.imageCover;
    }

    return currentProduct.imageCover;
  }

  get hasMultipleImages(): boolean {
    const currentProduct = this.product();
    return currentProduct ? (currentProduct.images?.length || 0) > 1 : false;
  }
}
