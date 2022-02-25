import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  isSubmitting = false;
  showPassword = false;
  showPasswordConfirmation = false;

  user?: User;

  notMatched = false;
  notMatchedMessage = '';

  noEmail = false;
  noEmailMessage = '';

  noPassword = false;
  noPasswordMessage = '';

  noPasswordConfirmation = false;
  noPasswordConfirmationMessage = '';

  noName = false;
  noNameMessage = '';

  noPhone = false;
  noPhoneMessage = '';

  canSubmit = false;

  user$ = this.authService.currentUser$;

  imageUrl =
    'https://firebasestorage.googleapis.com/v0/b/learning-pirate.appspot.com/o/iconLarge.png?alt=media&token=cb194f31-509d-44c2-b889-3e0eec25cf86';
  accountType = 'Basic Account';

  constructor(
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password')!.value;
    let confirmPass = group.get('passwordConfirmation')!.value;
    return pass === confirmPass ? null : { notSame: true };
  };

  form = this.formBuilder.group(
    {
      displayName: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'change',
        },
      ],
      phoneNumber: [
        '',
        {
          validators: [Validators.required],
          updateOn: 'change',
        },
      ],
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
      passwordConfirmation: [
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
    },
    { validators: this.checkPasswords }
  );

  /**
   * User registration
   * @param email
   * @param password
   * @param passwordConfirmation
   * @param displayName
   * @param phoneNumber
   * @returns user data
   */
  async onSubmit() {
    if (this.form.invalid) {
      this.toast.error(
        'You have to provide a valid user authentication data.',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.form.disable;

      let password = this.form.value.password;
      let email = this.form.value.email;
      let displayName = this.form.value.displayName;
      let phoneNumber = this.form.value.phoneNumber;

      let payload = {
        email: email,
        password: password,
        displayName: displayName,
        phoneNumber: phoneNumber,
        accountType: this.accountType,
        imageUrl: this.imageUrl,
      };

      this.authService
        .userSignUp(payload)
        .then(() => {
          this.toast.success(
            'You have successfully signed into the Admin Portal.',
            'Authentication Successful'
          );
          this.isSubmitting = false;
          this.form.enable;
          this.router.navigate(['/home']);
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

  checkPassword() {
    let password = this.form.value.password;
    if (password == '') {
      this.noPassword = true;
      this.noPasswordMessage = 'Password is required';
    } else {
      this.noPassword = false;
    }
  }

  checkPasswordConfirmation() {
    let passwordConfirmation = this.form.value.passwordConfirmation;
    if (passwordConfirmation == '') {
      this.noPasswordConfirmation = true;
      this.noPasswordConfirmationMessage = 'Password confirmation is required';
    } else {
      this.noPasswordConfirmation = false;
      this.checkPasswordMatch();
    }
  }

  checkPasswordMatch() {
    let password = this.form.value.password;
    let passwordConfirmation = this.form.value.passwordConfirmation;

    if (password != passwordConfirmation) {
      this.notMatched = true;
      this.notMatchedMessage =
        'Password and password confirmation do not match';
    } else {
      this.notMatched = false;
    }

    if (
      !this.noEmail &&
      !this.noPassword &&
      !this.noPasswordConfirmation &&
      !this.notMatched
    ) {
      this.canSubmit = true;
    } else {
      this.canSubmit = false;
    }
  }

  checkName() {
    let name = this.form.value.displayName;
    if (name == '') {
      this.noName = true;
      this.noNameMessage = 'Display name is required';
    } else {
      this.noName = false;
    }
  }

  checkPhone() {
    let phone = this.form.value.phoneNumber;
    if (phone == '') {
      this.noPhone = true;
      this.noPhoneMessage = 'Phone number is required';
    } else {
      this.noPhone = false;
    }
  }
}
