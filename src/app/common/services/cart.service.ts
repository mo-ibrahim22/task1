import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  CartResponse,
  AddToCartRequest,
  UpdateCartRequest,
} from '../models/cart.model';
import { environment } from '../../../environment/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  private getHeaders(): HttpHeaders {
    const token = this.authService.currentToken;
    return new HttpHeaders({
      token: `${token}`,
      'Content-Type': 'application/json',
    });
  }

  getCart(): Observable<CartResponse> {
    return this.http
      .get<CartResponse>(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  addToCart(productId: string): Observable<CartResponse> {
    const body: AddToCartRequest = { productId };
    return this.http
      .post<CartResponse>(`${this.apiUrl}/api/v1/cart`, body, {
        headers: this.getHeaders(),
      })
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  updateItem(productId: string, count: number): Observable<CartResponse> {
    const body: UpdateCartRequest = { count: count.toString() };
    return this.http
      .put<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  removeItem(productId: string): Observable<CartResponse> {
    return this.http
      .delete<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, {
        headers: this.getHeaders(),
      })
      .pipe(tap((cart) => this.cartSubject.next(cart)));
  }

  clearCart(): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.cartSubject.next(null)));
  }

  isInCart(productId: string): boolean {
    const cart = this.cartSubject.value;
    return (
      cart?.data.products.some(
        (item) =>
          item.product.id === productId || item.product._id === productId
      ) ?? false
    );
  }

  getTotalPrice(): number {
    return this.cartSubject.value?.data.totalCartPrice ?? 0;
  }

  getCartCount(): number {
    return this.cartSubject.value?.numOfCartItems ?? 0;
  }
}
