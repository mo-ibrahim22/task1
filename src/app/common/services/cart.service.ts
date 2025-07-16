import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  tap,
  catchError,
  throwError,
  EMPTY,
  of,
  switchMap,
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

  private cartSignal = signal<CartResponse | null>(null);
  private isLoadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  cart = this.cartSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  cartCount = computed(() => this.cartSignal()?.numOfCartItems ?? 0);
  totalPrice = computed(() => this.cartSignal()?.data?.totalCartPrice ?? 0);

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

  private handleError(operation: string) {
    return (error: any) => {
      console.error(`${operation} failed:`, error);
      this.isLoadingSignal.set(false);

      let errorMessage = 'An error occurred. Please try again.';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      this.errorSignal.set(errorMessage);

      // Clear error after 5 seconds
      setTimeout(() => this.errorSignal.set(null), 5000);

      return throwError(() => error);
    };
  }

  getCart(): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .get<CartResponse>(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.isLoadingSignal.set(false);
        }),
        catchError(this.handleError('Get cart'))
      );
  }

  addToCart(productId: string): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    const body: AddToCartRequest = { productId };
    return this.http
      .post<CartResponse>(`${this.apiUrl}/api/v1/cart`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        switchMap((response) => {
          // After adding, immediately fetch the full cart details
          return this.http.get<CartResponse>(`${this.apiUrl}/api/v1/cart`, {
            headers: this.getHeaders(),
          });
        }),
        tap((cart) => {
          this.cartSignal.set(cart);
          this.isLoadingSignal.set(false);
        }),
        catchError(this.handleError('Add to cart'))
      );
  }
  updateItem(productId: string, count: number): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    if (count <= 0) {
      return this.removeItem(productId);
    }

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    const body: UpdateCartRequest = { count: count.toString() };
    return this.http
      .put<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.isLoadingSignal.set(false);
        }),
        catchError(this.handleError('Update cart item'))
      );
  }

  removeItem(productId: string): Observable<CartResponse> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .delete<CartResponse>(`${this.apiUrl}/api/v1/cart/${productId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((cart) => {
          this.cartSignal.set(cart);
          this.isLoadingSignal.set(false);
        }),
        catchError(this.handleError('Remove cart item'))
      );
  }

  clearCart(): Observable<any> {
    if (!this.requireAuth()) {
      return EMPTY;
    }

    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    return this.http
      .delete(`${this.apiUrl}/api/v1/cart`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          this.cartSignal.set(null);
          this.isLoadingSignal.set(false);
        }),
        catchError(this.handleError('Clear cart'))
      );
  }

  isInCart(productId: string): boolean {
    if (!this.authService.isAuthenticated()) {
      return false;
    }

    const cart = this.cartSignal();
    if (!cart?.data?.products) {
      return false;
    }

    return cart.data.products.some(
      (item) => item.product.id === productId || item.product._id === productId
    );
  }

  getCartItemCount(productId: string): number {
    if (!this.authService.isAuthenticated()) {
      return 0;
    }

    const cart = this.cartSignal();
    if (!cart?.data?.products) {
      return 0;
    }

    const item = cart.data.products.find(
      (item) => item.product.id === productId || item.product._id === productId
    );

    return item?.count ?? 0;
  }

  // Initialize cart for authenticated users
  initializeCart(): void {
    if (this.authService.isAuthenticated()) {
      this.getCart().subscribe({
        error: (error) => {
          console.warn('Could not initialize cart:', error);
        },
      });
    } else {
      // Clear cart if user is not authenticated
      this.cartSignal.set(null);
    }
  }

  // Clear error manually
  clearError(): void {
    this.errorSignal.set(null);
  }
}
