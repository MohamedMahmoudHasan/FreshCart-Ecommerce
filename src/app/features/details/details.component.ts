import { ProductsService } from './../../core/services/product/products.service';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly pLATFORM_ID = inject(PLATFORM_ID);

  wishListProd = computed(() => this.wishlistService.wishList());

  swiperConfig = {
    spaceBetween: 10,
    navigation: false,
    pagination: { clickable: true },
    breakpoints: {
      0: { slidesPerView: 1 },
    },
  };
  product = signal<Product>({} as Product);

  ngOnInit(): void {
    // if (isPlatformBrowser(this.pLATFORM_ID)) {
    //   this.getWishList();
    // }
    this.activatedRoute.paramMap.subscribe((params) => {
      this.getSpecificProductsData(params.get('id')!);
    });
  }

  getSpecificProductsData(id: string): void {
    this.productsService.getSpecificProducts(id).subscribe({
      next: (res) => {
        this.product.set(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addToCart(prodId: string): void {
    if (localStorage.getItem('freshToken')) {
      this.cartService.AddProductToCart(prodId).subscribe((res) => {
        // console.log(res);
        this.cartService.cartCount.set(res.numOfCartItems);
      });
    } else {
      // this.toastrService.warning('Login First', 'freshCart', {
      //   progressBar: true,
      //   closeButton: true,
      // });
    }
  }

  addToWish(prodId: string): void {
    if (localStorage.getItem('freshToken')) {
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
      // this.toastrService.warning('Login First', 'freshCart', {
      //   progressBar: true,
      //   closeButton: true,
      // });
    }
  }

  getWishList(): void {
    this.wishlistService.getLoggedUserWishlist().subscribe((res) => {
      // this.wishlistService.wishList.set(res.data);
      // console.log(res.data);
      const idsOnly = res.data.map((item: any) => item.id || item._id);
      this.wishlistService.wishList.set(idsOnly);
    });
  }

  @ViewChild('swiperMain') swiperMain!: ElementRef;
  slideTo(index: number) {
    this.swiperMain.nativeElement.swiper.slideTo(index);
  }
}
