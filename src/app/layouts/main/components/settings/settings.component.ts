import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UserProfile } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  pages = [
    { url: '/profile', title: 'User' },
    { url: '/profile', title: 'Profile' },
  ];
  page = 'Account Settings';

  users: UserProfile[] = [];
  uid: string = '';

  canEdit = false;
  selectedItem: any;
  nextAccountType = '';

  isSubmitting = false;
  noDisplayName = false;
  noDisplayNameMessage = '';
  noPhoneNumber = false;
  noPhoneNumberMessage = '';

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  isAdmin = false;

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

    this.checkLevel();

    this.userService.getUsers().subscribe((res: UserProfile[]) => {
      this.users = res;
      this.dtTrigger.next(void 0);
    });

    this.dtOptions = {
      destroy: true,
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  editItem(item: any) {
    if (item.accountType == 'Basic Account') {
      this.nextAccountType = 'Admin Account';
    } else {
      this.nextAccountType = 'Basic Account';
    }
    this.canEdit = true;
    this.selectedItem = item;
  }

  /**
   * User registration
   * @param email
   * @param password
   * @returns user data
   */
  async onSubmit() {
    this.isSubmitting = true;

    let data = {
      accountType: this.nextAccountType,
    };

    this.userService
      .updateAccountType(this.selectedItem.id, data)
      .then(() => {
        this.toast.success(
          'You have successfully updated user account type.',
          'Request Successful'
        );
        this.isSubmitting = false;
        this.canEdit = false;
      })
      .catch((error) => {
        console.log(error);
        this.isSubmitting = false;
      });
  }

  // check level
  async checkLevel() {
    await this.userService.getUserById(this.uid).subscribe((result) => {
      if (result.accountType != 'Admin Account') {
        this.isAdmin = false;
      } else {
        this.isAdmin = true;
      }
    });
  }
}
