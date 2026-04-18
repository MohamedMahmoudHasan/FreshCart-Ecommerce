import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient);

  cartCount = signal<number>(0);

  saveCartLocally(data: any): void {
    localStorage.setItem('guestCart', JSON.stringify(data));
  }

  getLocalCart(): any {
    const cart = localStorage.getItem('guestCart');
    return cart ? JSON.parse(cart) : { products: [], totalCartPrice: 0 };
  }

  AddProductToCart(prodtId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v2/cart`, {
      productId: prodtId,
    });
  }

  CreateCashOrder(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `/api/v1/orders/${cartId}`, data);
  }
  Checkoutsession(cartId: string, data: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      data,
    );
  }

  GetLoggedUserCart(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `/api/v2/cart`);
  }

  RemoveProductFromCart(prodId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart/${prodId}`);
  }

  UpdateCartProductQuantity(prodId: string, count: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `/api/v2/cart/${prodId}`, {
      count: count,
    });
  }

  ClearUserCart(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `/api/v2/cart`);
  }

  syncCartToServer() {
    const localCart = this.getLocalCart();
    if (localCart.products.length > 0) {
      this.cartCount.set(localCart.products.length);
      localCart.products.forEach((item: any) => {
        this.AddProductToCart(item.product._id).subscribe();
      });
      localStorage.removeItem('guestCart');
    }
  }
}
