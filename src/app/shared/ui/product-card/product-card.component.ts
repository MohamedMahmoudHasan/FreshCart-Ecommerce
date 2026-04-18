import { ToastrService } from 'ngx-toastr';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import { WishlistService } from '../../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);
  private readonly wishlistService = inject(WishlistService);

  product: InputSignal<Product> = input.required();
  wishListProd = computed(() => this.wishlistService.wishList());

  ngOnInit(): void {}

  getWishList(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe((res) => {
      // this.wishList.set(res.data);
      console.log(res.data);
    });
  }

  // addToCart(prodId: string): void {
  //   if (localStorage.getItem('freshToken')) {
  //     this.cartService.AddProductToCart(prodId).subscribe((res) => {
  //       console.log(res);
  //       this.cartService.cartCount.set(res.numOfCartItems);
  //     });
  //   } else {
  //     // this.toastrService.warning('Login First', 'freshCart', {
  //     //   progressBar: true,
  //     //   closeButton: true,
  //     // });
  //   }
  // }

  addToCart(prodId: string): void {
    const token = localStorage.getItem('freshToken');
    const currentProd = this.product();

    if (token) {
      this.cartService.AddProductToCart(prodId).subscribe((res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastrService.success(res.message);
      });
    } else {
      let cart = this.cartService.getLocalCart();
      const item = cart.products.find((p: any) => p.product._id === prodId);

      if (item) {
        item.count++;
      } else {
        cart.products.push({ count: 1, product: currentProd, price: currentProd.price });
      }

      cart.totalCartPrice = cart.products.reduce((acc: any, p: any) => acc + p.price * p.count, 0);
      this.cartService.saveCartLocally(cart);
      this.cartService.cartCount.set(cart.products.length);
      this.toastrService.info('Added to local cart');
    }
  }

  addToWish(prodId: string): void {
    const token = localStorage.getItem('freshToken');
    const currentProd = this.product();

    if (token) {
      if (this.wishListProd().includes(prodId)) {
        this.wishlistService.removeProductFromWishlist(prodId).subscribe((res) => {
          this.wishlistService.wishList.set(res.data);
          this.wishlistService.wishlistCount.set(res.data.length);
        });
      } else {
        this.wishlistService.addProductToWishlist(prodId).subscribe((res) => {
          this.wishlistService.wishList.set(res.data);
          this.wishlistService.wishlistCount.set(res.data.length);
        });
      }
    } else {
      let localWish = this.wishlistService.getLocalWishlist();
      const index = localWish.findIndex((item) => item._id === prodId);

      if (index > -1) {
        localWish.splice(index, 1);
      } else {
        localWish.push(currentProd);
      }

      this.wishlistService.saveWishlistLocally(localWish);
      this.wishlistService.wishList.set(localWish.map((i) => i._id));
      this.wishlistService.wishlistCount.set(localWish.length);
    }
  }
}
