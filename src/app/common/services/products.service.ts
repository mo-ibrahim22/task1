import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse } from '../models/product.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/api/v1/products`);
  }

  getProductById(id: string): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(
      `${this.apiUrl}/api/v1/products/${id}`
    );
  }
}
