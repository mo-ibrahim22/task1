import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Product } from '../models/product.model';

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
}

export interface CartProduct extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private cartItemsSubject = new BehaviorSubject<CartProduct[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  public cartItems$ = this.cartItemsSubject.asObservable();
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private loadCart(): void {
    // Using cart ID 1 for demo purposes
    this.http.get<Cart>(`${this.apiUrl}/carts/1`).subscribe({
      next: (cart) => {
        this.loadCartProducts(cart.products);
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      },
    });
  }

  private loadCartProducts(cartItems: CartItem[]): void {
    const productRequests = cartItems.map((item) =>
      this.http.get<Product>(`${this.apiUrl}/products/${item.productId}`)
    );

    if (productRequests.length === 0) {
      this.cartItemsSubject.next([]);
      this.cartCountSubject.next(0);
      return;
    }

    // For demo, we'll simulate the cart products
    const cartProducts: CartProduct[] = [];
    let loadedCount = 0;

    cartItems.forEach((cartItem, index) => {
      this.http
        .get<Product>(`${this.apiUrl}/products/${cartItem.productId}`)
        .subscribe({
          next: (product) => {
            cartProducts.push({ ...product, quantity: cartItem.quantity });
            loadedCount++;

            if (loadedCount === cartItems.length) {
              this.cartItemsSubject.next(cartProducts);
              this.updateCartCount();
            }
          },
          error: (err) => {
            console.error('Error loading product:', err);
            loadedCount++;

            if (loadedCount === cartItems.length) {
              this.cartItemsSubject.next(cartProducts);
              this.updateCartCount();
            }
          },
        });
    });
  }

  addToCart(product: Product): Observable<any> {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentItems.push({ ...product, quantity: 1 });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.updateCartCount();

    // Simulate API call
    return this.http.post(`${this.apiUrl}/carts`, {
      userId: 1,
      date: new Date().toISOString(),
      products: currentItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    });
  }

  removeFromCart(productId: number): Observable<any> {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter((item) => item.id !== productId);

    this.cartItemsSubject.next(updatedItems);
    this.updateCartCount();

    // Simulate API call
    return this.http.put(`${this.apiUrl}/carts/1`, {
      userId: 1,
      date: new Date().toISOString(),
      products: updatedItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    });
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find((item) => item.id === productId);

    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(productId);
      }
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentItems]);
      this.updateCartCount();
    }

    // Simulate API call
    return this.http.put(`${this.apiUrl}/carts/1`, {
      userId: 1,
      date: new Date().toISOString(),
      products: currentItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    });
  }

  private updateCartCount(): void {
    const items = this.cartItemsSubject.value;
    const count = items.reduce((total, item) => total + item.quantity, 0);
    this.cartCountSubject.next(count);
  }

  get cartItems(): CartProduct[] {
    return this.cartItemsSubject.value;
  }

  get cartCount(): number {
    return this.cartCountSubject.value;
  }

  isInCart(productId: number): boolean {
    return this.cartItemsSubject.value.some((item) => item.id === productId);
  }
}
