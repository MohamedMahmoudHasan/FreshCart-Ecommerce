import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private readonly httpClient = inject(HttpClient);

  wishlistCount = signal<number>(0);

  wishList = signal<string[]>([]);

  getLoggedUserWishlist(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v1/wishlist`);
  }
  removeProductFromWishlist(prodId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v1/wishlist/${prodId}`);
  }
  addProductToWishlist(prodId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/wishlist`, {
      productId: prodId,
    });
  }

  saveWishlistLocally(data: any): void {
    localStorage.setItem('guestWishlist', JSON.stringify(data));
  }

  getLocalWishlist(): any[] {
    const list = localStorage.getItem('guestWishlist');
    return list ? JSON.parse(list) : [];
  }
}
