import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Testimonial } from 'src/app/interfaces/testimonial';
import { TestimonialService } from 'src/app/services/testimonial.service';
import { UserService } from 'src/app/services/user.service';

import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders,
} from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'app-testimonial',
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss'],
})
export class TestimonialComponent implements OnInit {
  pages = [
    { url: '/testimonials', title: 'Client' },
    { url: '/testimonials', title: 'Testimony' },
  ];
  page = 'Testimonials';

  testimonials: Testimonial[] = [];

  selectedItem: any;
  chosenItem: any;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  uid: any;
  isAdmin = false;
  canEdit = false;
  isSubmitting = false;

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
    private testimonialService: TestimonialService,
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

    this.testimonialService.getAll().subscribe((res: Testimonial[]) => {
      this.testimonials = res;
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
    name: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    testimony: [
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

      let name = this.form.value.name;
      let title = this.form.value.title;
      let testimony = this.form.value.testimony;
      let imageUrl = this.uploadedUrl;

      let data = {
        title: title,
        testimony: testimony,
        imageUrl: imageUrl,
        name: name,
      };

      this.testimonialService
        .create(data)
        .then(() => {
          this.toast.success(
            'You have successfully added a testimony.',
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

      let name = this.form.value.name;
      let title = this.form.value.title;
      let testimony = this.form.value.testimony;
      let imageUrl = this.uploadedUrl;

      let data = {
        title: title,
        testimony: testimony,
        imageUrl: imageUrl,
        name: name,
      };

      this.testimonialService
        .update(this.chosenItem.id, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a testimony.',
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

  editItem(item: any) {
    this.canEdit = true;
    this.chosenItem = item;
    this.uploadedUrl = item.imageUrl;
  }

  deleteItem(item: any) {
    this.selectedItem = item;
  }

  async onDelete(id: string) {
    this.testimonialService.delete(id).then(() => {
      this.toast.success('Testimony deletion successful', 'Request Successful');
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
