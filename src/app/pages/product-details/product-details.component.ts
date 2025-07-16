import { Component, OnInit, inject } from '@angular/core';
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

  product: Product | null = null;
  isLoading = true;
  selectedImageIndex = 0;

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private loadProduct(id: string): void {
    this.isLoading = true;
    this.productsService.getProductById(id).subscribe({
      next: (response) => {
        this.product = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.isLoading = false;
        this.router.navigate(['/shop']);
      },
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  isInCart(): boolean {
    return this.product ? this.cartService.isInCart(this.product.id) : false;
  }

  toggleCart(): void {
    if (!this.product) return;

    if (this.isInCart()) {
      this.cartService.removeItem(this.product.id).subscribe(() => {
        this.cartService.getCart().subscribe(); // refresh local cache
      });
    } else {
      this.cartService.addToCart(this.product.id).subscribe(() => {
        this.cartService.getCart().subscribe(); // refresh local cache
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
}
