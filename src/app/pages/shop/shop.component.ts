import { Component, OnInit, inject, signal, effect } from '@angular/core';
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

  isloading = signal(false);
  products = signal<Product[]>([]);
  allProducts = signal<Product[]>([]);

  constructor() {
    // React to search term changes
    effect(() => {
      const searchTerm = this.filterService.searchTerm();
      this.filterProducts(searchTerm);
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  private filterProducts(term: string) {
    if (!term) {
      this.products.set([...this.allProducts()]);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = this.allProducts().filter((product) =>
      product.title.toLowerCase().includes(lowerTerm)
    );
    this.products.set(filtered);
  }

  private getProducts() {
    this.isloading.set(true);
    this.productsService.getProducts().subscribe({
      next: (response: ProductsResponse) => {
        this.allProducts.set(response.data);
        this.products.set([...response.data]);
        this.isloading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isloading.set(false);
        this.products.set([]);
      },
    });
  }
}
