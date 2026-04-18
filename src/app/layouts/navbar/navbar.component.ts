import { AuthService } from './../../core/auth/services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  logged = computed(() => this.authService.isLogged());

  count = computed(() => this.cartService.cartCount());
  wishCount = computed(() => this.wishlistService.wishlistCount());

  isMenuOpen = false;

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      const token = localStorage.getItem('freshToken');

      if (token) {
        this.authService.isLogged.set(true);

        this.syncCart();
        this.syncWishlist();

        this.getCartCount();
        this.getWishCount();
      } else {
        this.loadGuestCounts();
      }
    }
  }

  logOut(): void {
    this.authService.signOut();
  }

  getCartCount(): void {
    this.cartService.GetLoggedUserCart().subscribe((res) => {
      this.cartService.cartCount.set(res.numOfCartItems);
    });
  }
  getWishCount(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe((res) => {
      this.wishlistService.wishlistCount.set(res.data.length);
    });
  }

  syncCart(): void {
    const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"products":[]}');

    if (localCart.products.length > 0) {
      localCart.products.forEach((item: any) => {
        this.cartService.AddProductToCart(item.product._id).subscribe({
          next: (res) => {
            this.cartService.cartCount.set(res.numOfCartItems);
          },
        });
      });
      localStorage.removeItem('guestCart');
    }
  }

  loadGuestCounts(): void {
    const localCart = JSON.parse(localStorage.getItem('guestCart') || '{"products":[]}');
    this.cartService.cartCount.set(localCart.products.length);

    const localWish = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
    this.wishlistService.wishlistCount.set(localWish.length);

    const idsOnly = localWish.map((item: any) => item._id || item.id);
    this.wishlistService.wishList.set(idsOnly);
  }

  syncWishlist(): void {
    const localWish = this.wishlistService.getLocalWishlist();
    if (localWish.length > 0) {
      localWish.forEach((item) => {
        this.wishlistService.addProductToWishlist(item._id).subscribe();
      });
      localStorage.removeItem('guestWishlist');
    }
  }
}
