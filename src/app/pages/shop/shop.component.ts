// features/shop/shop.component.ts

import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from '../../components/item-card/item-card.component';
import { MemberCardComponent } from '../../components/member-card/member-card.component';
import { Product } from '../../common/models/product.model';
import { Member } from '../../common/models/member.model';
import { MEMBERS } from '../../common/data/members.data';
import { ProductsService } from '../../common/services/products.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ItemCardComponent, MemberCardComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit {
  private productsService = inject(ProductsService);

  isloading = false;
  products: Product[] = [];
  allProducts: Product[] = [];

  allMembers: Member[] = MEMBERS;
  filteredMembers: Member[] = MEMBERS;

  ngOnInit(): void {
    this.getProducts();
  }

  @Input() set searchTerm(term: string) {
    this.filterMembers(term);
    this.filterProducts(term);
  }

  private filterMembers(term: string) {
    if (!term) {
      this.filteredMembers = [...this.allMembers];
      return;
    }

    const lowerTerm = term.toLowerCase();
    this.filteredMembers = this.allMembers.filter((member) =>
      member.name.toLowerCase().includes(lowerTerm)
    );
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
      next: (response) => {
        this.allProducts = response;
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
