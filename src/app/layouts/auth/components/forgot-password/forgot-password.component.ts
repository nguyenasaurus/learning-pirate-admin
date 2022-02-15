import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  isSubmitting = false;

  noEmail = false;
  noEmailMessage = '';

  canSubmit = false;

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private authService: AuthService,
    private router: Router
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
  });

  /**
   * User registration
   * @param email
   * @returns user data
   */
  async onSubmit() {
    if (this.form.invalid) {
      this.checkEmail();
      return;
    } else {
      this.isSubmitting = true;
      this.form.disable;

      // Destructure form
      const { email } = this.form.value;

      this.authService
        .changePassword(email)
        .then(() => {
          this.toast.success(
            'A password reset mail was sent to the provided email address. Follow the instructions to complete this process.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.form.enable;
          this.router.navigate(['/sign-in']);
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.form.enable;
        });
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
}
