import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ProductCardComponent } from '../../../../shared/ui/product-card/product-card.component';
import { ProductsService } from '../../../../core/services/product/products.service';
import { WishlistService } from '../../../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product-home',
  imports: [ProductCardComponent],
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.css',
})
export class ProductHomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  productList = signal<Product[]>([]);
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.pLATFORM_ID)) {
      this.getWishList();
    }
    this.getAllProductsData();
  }

  getAllProductsData(): void {
    this.productsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getWishList(): void {
    const token = localStorage.getItem('freshToken');

    if (token) {
      this.wishlistService.getLoggedUserWishlist().subscribe({
        next: (res) => {
          const idsOnly = res.data.map((item: any) => item.id || item._id);
          this.wishlistService.wishList.set(idsOnly);
          this.wishlistService.wishlistCount.set(res.data.length);
        },
      });
    } else {
      const localWish = this.wishlistService.getLocalWishlist();
      const idsOnly = localWish.map((item: any) => item.id || item._id);
      this.wishlistService.wishList.set(idsOnly);
      this.wishlistService.wishlistCount.set(localWish.length);
    }
  }
}
