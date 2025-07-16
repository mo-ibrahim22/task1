import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  throwError,
  EMPTY,
} from 'rxjs';
import {
  CartResponse,
  AddToCartRequest,
  UpdateCartRequest,
} from '../models/cart.model';
import { environment } from '../../../environment/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);

  cart$ = this.cartSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();

  private requireAuth(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
      return false;
    }
    return true;
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.currentToken;
    return new HttpHeaders({
      token: `${token}`,
      'Content-Type': 'application/json',
    });
  }

  getCart(): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSubject.next(true);
    return this.http
      .get<CartResponse>(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSubject.next(cart);
          this.isLoadingSubject.next(false);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          console.error('Error fetching cart:', error);
          return throwError(() => error);
        })
      );
  }

  addToCart(productId: string): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSubject.next(true);
    const body: AddToCartRequest = { productId };
    return this.http
      .post<CartResponse>(`${this.apiUrl}/api/v1/cart`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSubject.next(cart);
          this.isLoadingSubject.next(false);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          console.error('Error adding to cart:', error);
          return throwError(() => error);
        })
      );
  }

  updateItem(productId: string, count: number): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSubject.next(true);
    const body: UpdateCartRequest = { count: count.toString() };
    return this.http
      .put<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSubject.next(cart);
          this.isLoadingSubject.next(false);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          console.error('Error updating cart item:', error);
          return throwError(() => error);
        })
      );
  }

  removeItem(productId: string): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSubject.next(true);
    return this.http
      .delete<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSubject.next(cart);
          this.isLoadingSubject.next(false);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          console.error('Error removing cart item:', error);
          return throwError(() => error);
        })
      );
  }

  clearCart(): Observable<any> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSubject.next(true);
    return this.http
      .delete(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          this.cartSubject.next(null);
          this.isLoadingSubject.next(false);
        }),
        catchError((error) => {
          this.isLoadingSubject.next(false);
          console.error('Error clearing cart:', error);
          return throwError(() => error);
        })
      );
  }

  isInCart(productId: string): boolean {
    if (!this.authService.isAuthenticated()) {
      return false;
    }
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

  // Initialize cart for authenticated users
  initializeCart(): void {
    if (this.authService.isAuthenticated()) {
      this.getCart().subscribe({
        error: (error) => {
          // Handle cart initialization error silently
          console.warn('Could not initialize cart:', error);
        },
      });
    }
  }
}
