import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Conference } from 'src/app/interfaces/conference';
import { ConferenceService } from 'src/app/services/conference.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-conferences',
  templateUrl: './conferences.component.html',
  styleUrls: ['./conferences.component.scss'],
})
export class ConferencesComponent implements OnInit {
  pages = [
    { url: '/conferences', title: 'Media' },
    { url: '/conferences', title: 'Conferences' },
  ];
  page = 'Conference';

  conferences: Conference[] = [];

  selectedItem: any;
  chosenItem: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  isSubmitting = false;
  canEdit = false;
  isAdmin = false;
  uid: any;

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private conferenceService: ConferenceService,
    private userService: UserService
  ) {
    this.titleService.setTitle(this.page);
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    this.checkLevel();

    this.conferenceService.getConferences().subscribe((res: Conference[]) => {
      this.conferences = res;
      this.dtTrigger.next(void 0);
    });

    this.dtOptions = {
      destroy: true,
    };
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

  form = this.formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    description: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    imageUrl: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    publishedOn: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    url: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

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

      let title = this.form.value.title;
      let description = this.form.value.description;
      let imageUrl = this.form.value.imageUrl;
      let publishedOn = this.form.value.publishedOn;
      let url = this.form.value.url;

      let data = {
        title: title,
        description: description,
        imageUrl: imageUrl,
        publishedOn: publishedOn,
        url: url,
      };

      this.conferenceService
        .create(data)
        .then(() => {
          this.toast.success(
            'You have successfully added a new conference.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.form.enable;
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.form.enable;
        });
    }
  }

  async onEditSubmit() {
    if (this.form.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.form.disable;

      let title = this.form.value.title;
      let description = this.form.value.description;
      let imageUrl = this.form.value.imageUrl;
      let publishedOn = this.form.value.publishedOn;
      let url = this.form.value.url;

      let data = {
        title: title,
        description: description,
        imageUrl: imageUrl,
        publishedOn: publishedOn,
        url: url,
      };

      this.conferenceService
        .update(this.chosenItem.id, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated an item.',
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

  editItem(item: any) {
    this.canEdit = true;
    this.chosenItem = item;
  }

  deleteItem(item: any) {
    this.selectedItem = item;
  }

  async onDelete(id: string) {
    this.conferenceService.delete(id).then(() => {
      this.toast.success('Item deletion successful', 'Request Successful');
      window.location.reload();
    });
  }
}