import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  cartId = signal<string>('');
  cashOrVisa = signal<string>('cash');

  checkOutForm = this.fb.group({
    shippingAddress: this.fb.group({
      details: ['', Validators.required],
      phone: ['', Validators.required],
      city: ['', Validators.required],
    }),
  });

  ngOnInit(): void {
    this.getCartId();
  }

  getCartId(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      // console.log(param.get('id'));
      this.cartId.set(param.get('id')!);
    });
  }

  changePayment(el: HTMLInputElement): void {
    this.cashOrVisa.set(el.value);
  }

  submitForm(): void {
    if (this.checkOutForm.valid) {
      // console.log(this.checkOutForm.value);

      if (this.cashOrVisa() == 'visa') {
        // console.log('visa');
        this.cartService
          .Checkoutsession(this.cartId(), this.checkOutForm.value)
          .subscribe((res) => {
            if (res.status == 'success') {
              window.open(res.session.url, '_self');
              // console.log(res);
            }
          });
      } else {
        this.cartService
          .CreateCashOrder(this.cartId(), this.checkOutForm.value)
          .subscribe((res) => {
            if (res.status == 'success') {
              this.router.navigate(['/allorders']);
            }
          });
      }
    }
  }
}
