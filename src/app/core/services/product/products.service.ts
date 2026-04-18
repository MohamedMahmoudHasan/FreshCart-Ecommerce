import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly httpClient = inject(HttpClient);

  getAllProducts(pageNum: number = 1): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products?page=${pageNum}`);
  }
  getSpecificProducts(productId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products/${productId}`);
  }
  getProductsByCategory(categoryId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products?category=${categoryId}`);
  }
  getProductsBybrand(brandId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/products?brand=${brandId}`);
  }
}
