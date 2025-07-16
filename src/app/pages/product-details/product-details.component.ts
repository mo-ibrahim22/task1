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
    return currentProduct ? this.cartService.isInCart(currentProduct.id) : false;
  }

  toggleCart(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    if (this.isInCart()) {
      this.cartService.removeItem(currentProduct.id).subscribe({
        next: () => {
          // Cart will be updated automatically via signals
        },
        error: (err) => {
          console.error('Error removing from cart:', err);
        }
      });
    } else {
      this.cartService.addToCart(currentProduct.id).subscribe({
        next: () => {
          // Cart will be updated automatically via signals
        },
        error: (err) => {
          console.error('Error adding to cart:', err);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/shop']);
  }

  get cartButtonClass(): string {
    return this.isInCart()
      ? 'bg-red-500 hover:bg-red-600 text-white'
      : 'bg-primary-600 hover:bg-primary-700 text-white';
  }

  get cartButtonText(): string {
    return this.isInCart() ? 'Remove from Cart' : 'Add to Cart';
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