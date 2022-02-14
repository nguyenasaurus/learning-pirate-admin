import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  isSubmitting = false;
  showPassword = false;

  user?: User;

  noEmail = false;
  noEmailMessage = '';

  noPassword = false;
  noPasswordMessage = '';

  canSubmit = false;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private authService: AuthService,
    private router: Router,
    private hotToast: HotToastService
  ) {}

  ngOnInit(): void {}

  form = this.formBuilder.group({
    email: [
      '',
      {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(100),
        ],
        updateOn: 'change',
      },
    ],
    password: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
        ],
        updateOn: 'change',
      },
    ],
  });

  /**
   * User registration
   * @param email
   * @param password
   * @returns user data
   */
  async onSubmit() {
    if (this.form.invalid) {
      this.checkEmail();
      this.checkPassword();
      return;
    } else {
      this.isSubmitting = true;
      this.form.disable;

      // Destructure form
      const { email, password } = this.form.value;

      this.authService
        .emailSignIn(email, password)
        .pipe(
          this.hotToast.observe({
            success: 'Authentication successful',
            loading: 'Authenticating...',
            error: 'Authentication failed',
          })
        )
        .subscribe(() => {
          this.isSubmitting = false;
          this.router.navigate(['/dashboard']);
        });
      this.isSubmitting = false;
    }
  }

  checkEmail() {
    let email = this.form.value.email;
    if (email == '') {
      this.noEmail = true;
      this.noEmailMessage = 'Valid email address is required';
    } else {
      this.noEmail = false;
    }
  }

  checkPassword() {
    let password = this.form.value.password;
    if (password == '') {
      this.noPassword = true;
      this.noPasswordMessage = 'Password is required';
    } else {
      this.noPassword = false;
    }
  }
}
