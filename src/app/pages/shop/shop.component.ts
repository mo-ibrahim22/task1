// features/shop/shop.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { Product, ProductsResponse } from '../../common/models/product.model';
import { ProductsService } from '../../common/services/products.service';
import { FilterService } from '../../common/services/filter.service';
import { ProductModalComponent } from '../../components/product-modal/product-modal.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ItemCardComponent, ProductModalComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private productsService = inject(ProductsService);
  private filterService = inject(FilterService);

  isloading = false;
  products: Product[] = [];
  allProducts: Product[] = [];

  ngOnInit(): void {
    this.getProducts();
    this.filterService.searchTerm$.subscribe((term) => {
      this.filterProducts(term);
    });
  }

  private filterProducts(term: string) {
    if (!term) {
      this.products = [...this.allProducts];
      return;
    }

    const lowerTerm = term.toLowerCase();
    this.products = this.allProducts.filter((product) =>
      product.title.toLowerCase().includes(lowerTerm)
    );
  }

  private getProducts() {
    this.isloading = true;
    this.productsService.getProducts().subscribe({
      next: (response: ProductsResponse) => {
        this.allProducts = response.data;
        this.products = [...this.allProducts];
        this.isloading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isloading = false;
        this.products = [];
      },
    });
  }
}
