import { isPlatformBrowser } from '@angular/common';
import { WishlistService } from './../../core/services/wishlist/wishlist.service';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  wishlistItems = signal<WishList[]>([]);
  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getWishlist();
    }
  }

  addToCart(prodId: string): void {
    const token = localStorage.getItem('freshToken');

    if (token) {
      this.cartService.AddProductToCart(prodId).subscribe((res) => {
        this.cartService.cartCount.set(res.numOfCartItems);
        this.toastrService.success(res.message);
      });
    }
  }

  getWishlist(): void {
    const token = localStorage.getItem('freshToken');
    if (token) {
      this.wishlistService.getLoggedUserWishlist().subscribe((res) => {
        this.wishlistItems.set(res.data);
        this.wishlistService.wishlistCount.set(res.data.length);
        this.wishlistService.wishList.set(res.data.map((i: any) => i._id));
      });
    } else {
      const localData = this.wishlistService.getLocalWishlist();
      console.log(localData);

      this.wishlistItems.set(localData);
      this.wishlistService.wishlistCount.set(localData.length);
    }
  }

  removeItem(prodId: string): void {
    const token = localStorage.getItem('freshToken');
    if (token) {
      this.wishlistService.removeProductFromWishlist(prodId).subscribe((res) => {
        this.wishlistService.wishlistCount.set(res.data.length);
        this.getWishlist();
      });
    } else {
      let localWish = this.wishlistService.getLocalWishlist();
      localWish = localWish.filter((item) => item._id !== prodId);
      this.wishlistService.saveWishlistLocally(localWish);
      this.wishlistItems.set(localWish);
      this.wishlistService.wishlistCount.set(localWish.length);
      this.wishlistService.wishList.set(localWish.map((i) => i._id));
    }
  }
}
