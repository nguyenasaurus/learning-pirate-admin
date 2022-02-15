import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  pages = [{ url: '/profile', title: 'User' }];
  page = 'Profile';

  user: any;
  uid: string = '';

  canEdit = false;

  isSubmitting = false;
  noDisplayName = false;
  noDisplayNameMessage = '';
  noPhoneNumber = false;
  noPhoneNumberMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private userService: UserService,
    private toast: ToastrService
  ) {
    this.titleService.setTitle(this.page);
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    if (this.uid != null) {
      this.fetchUserProfile(this.uid);
    }
  }

  async fetchUserProfile(id: string) {
    await this.userService.getUserById(id).subscribe((result) => {
      this.user = result;
    });
  }

  form = this.formBuilder.group({
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
  });

  /**
   * User registration
   * @param email
   * @param password
   * @returns user data
   */
  async onSubmit() {
    if (this.form.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.form.disable;

      let displayName = this.form.value.displayName;
      let phoneNumber = this.form.value.phoneNumber;
      let email = this.user.email;
      let accountType = this.user.accountType;
      let imageUrl = this.user.imageUrl;

      let data = {
        displayName: displayName,
        phoneNumber: phoneNumber,
        email: email,
        accountType: accountType,
        imageUrl: imageUrl,
      };

      this.userService
        .update(this.uid, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated your profile information.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.form.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.form.enable;
        });
    }
  }

  checkName() {
    let displayName = this.form.value.displayName;
    if (displayName == '') {
      this.noDisplayName = true;
      this.noDisplayNameMessage = 'Valid name is required';
    } else {
      this.noDisplayName = false;
    }
  }

  checkPhoneNumber() {
    let phoneNumber = this.form.value.phoneNumber;
    if (phoneNumber == '') {
      this.noPhoneNumber = true;
      this.noPhoneNumberMessage = 'Valid name is required';
    } else {
      this.noPhoneNumber = false;
    }
  }
}
