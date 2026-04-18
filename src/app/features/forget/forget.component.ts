import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.css',
})
export class ForgetComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  step = signal<number>(1);

  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  code: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  ]);

  submitEmail(e: Event) {
    e.preventDefault();
    if (this.email.valid) {
      const data = {
        email: this.email.value,
      };

      this.authService.forgotPasswords(data).subscribe((res) => {
        this.step.set(2);
      });
    } else {
      this.email.markAsTouched();
    }
  }
  submitCode(e: Event) {
    e.preventDefault();
    if (this.code.valid) {
      const data = {
        resetCode: this.code.value,
      };
      this.authService.verifyResetCode(data).subscribe((res) => {
        this.step.set(3);
      });
    } else {
      this.code.markAsTouched();
    }
  }
  submitPassword(e: Event) {
    e.preventDefault();
    if (this.password.valid) {
      const data = {
        email: this.email.value,
        newPassword: this.password.value,
      };

      this.authService.resetPassword(data).subscribe((res) => {
        this.router.navigate(['/']);
      });
    } else {
      this.password.markAsTouched();
    }
  }
}
