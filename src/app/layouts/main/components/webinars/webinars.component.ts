import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Conference } from 'src/app/interfaces/conference';
import { UserService } from 'src/app/services/user.service';
import { WebinarService } from 'src/app/services/webinar.service';

import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders,
} from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'app-webinars',
  templateUrl: './webinars.component.html',
  styleUrls: ['./webinars.component.scss'],
})
export class WebinarsComponent implements OnInit {
  pages = [
    { url: '/webinars', title: 'Media' },
    { url: '/webinars', title: 'Webinars' },
  ];
  page = 'Webinars';

  webinars: Conference[] = [];

  selectedItem: any;
  chosenItem: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  isSubmitting = false;
  canEdit = false;
  isAdmin = false;
  uid: any;

  imageSrc!: any;
  uploadedUrl!: any;
  public uploader: any = FileUploader;
  imageTitle: string = '';
  hasBaseDropZoneOver: boolean = false;
  @Input() responses: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private webinarService: WebinarService,
    private userService: UserService,
    private cloudinary: Cloudinary,
    private zone: NgZone
  ) {
    this.titleService.setTitle(this.page);
    this.responses = [];
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    this.checkLevel();

    this.webinarService.getWebinars().subscribe((res: Conference[]) => {
      this.webinars = res;
      this.dtTrigger.next(void 0);
    });

    this.dtOptions = {
      destroy: true,
    };

    // File Upload
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${
        this.cloudinary.config().cloud_name
      }/upload`,
      autoUpload: true,
      isHTML5: true,
      removeAfterUpload: true,
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest',
        },
      ],
    };

    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      let tags = 'tocadmin';
      if (this.imageTitle) {
        form.append('context', `photo=${this.imageTitle}`);
        tags = `tocadmin,${this.imageTitle}`;
      }

      form.append('folder', 'tocadmin');
      form.append('tags', tags);
      form.append('file', fileItem);

      fileItem.withCredentials = false;
      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = (fileItem: any) => {
      this.zone.run(() => {
        const existingId = this.responses.reduce(
          (prev: any, current: any, index: any) => {
            if (current.file.name === fileItem.file.name && !current.status) {
              return index;
            }
            return prev;
          },
          -1
        );
        if (existingId > -1) {
          this.responses[existingId] = Object.assign(
            this.responses[existingId],
            fileItem
          );
        } else {
          this.responses.push(fileItem);
        }

        // Process response
        this.responses.forEach((item: any) => {
          this.uploadedUrl = item.data.secure_url;
        });
      });
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (
      item: any,
      response: string,
      status: number,
      headers: ParsedResponseHeaders
    ) =>
      upsertResponse({
        file: item.file,
        status,
        data: JSON.parse(response),
      });

    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) =>
      upsertResponse({
        file: fileItem.file,
        progress,
        data: {},
      });
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
      let imageUrl = this.uploadedUrl;
      let publishedOn = this.form.value.publishedOn;
      let url = this.form.value.url;

      let data = {
        title: title,
        description: description,
        imageUrl: imageUrl,
        publishedOn: publishedOn,
        url: url,
      };

      this.webinarService
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
      let imageUrl = this.uploadedUrl;
      let publishedOn = this.form.value.publishedOn;
      let url = this.form.value.url;

      let data = {
        title: title,
        description: description,
        imageUrl: imageUrl,
        publishedOn: publishedOn,
        url: url,
      };

      this.webinarService
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
    this.webinarService.delete(id).then(() => {
      this.toast.success('Item deletion successful', 'Request Successful');
      window.location.reload();
    });
  }

  updateTitle(value: string) {
    this.imageTitle = value;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
