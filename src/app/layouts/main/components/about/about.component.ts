import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { About, AboutCta, Qualification } from 'src/app/interfaces/about';
import { AboutService } from 'src/app/services/about.service';
import { UserService } from 'src/app/services/user.service';

import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders,
} from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  pages = [
    { url: '/', title: 'Dashboard' },
    { url: '/about', title: 'About' },
  ];
  page = 'About';

  selectedItem: any;
  chosenItem: any;

  uid: any;
  isAdmin = false;
  canEdit = false;
  isSubmitting = false;

  sectionOne: About = {};
  sectionOneId = 'sectionOne';
  canEditSectionOne = false;
  canUploadSectionOne = false;
  canAddQualification = false;

  sectionTwo: AboutCta = {};
  sectionTwoId = 'sectionCta';
  canEditSectionTwo = false;
  chosenItemTwo: any;

  imageSrc!: any;
  uploadedUrl!: any;
  public uploader: any = FileUploader;
  imageTitle: string = '';
  hasBaseDropZoneOver: boolean = false;
  @Input() responses: Array<any>;

  btnPages = [
    { title: 'Contact Me', url: '/contact-me' },
    { title: 'Membership', url: '/membership' },
  ];

  selectedBtnPage = '';
  selectedBtnPageUrl = '';
  selectedBtnPage2 = '';
  selectedBtnPageUrl2 = '';

  qualifications: Qualification[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private aboutService: AboutService,
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

    this.aboutService.getById(this.sectionOneId).subscribe((res: About) => {
      this.sectionOne = res;
      this.selectedBtnPageUrl = res.btnLink!;
    });

    this.aboutService.getQualifications().subscribe((res: Qualification[]) => {
      this.qualifications = res;
    });

    this.aboutService.getById(this.sectionTwoId).subscribe((res: AboutCta) => {
      this.sectionTwo = res;
      this.selectedBtnPageUrl2 = res.btnLink!;
    });

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

  setActiveItem(item: any) {
    this.selectedBtnPage = item.url;
    this.selectedBtnPageUrl = item.url;
  }

  setActiveItem2(item: any) {
    this.selectedBtnPage2 = item.url;
    this.selectedBtnPageUrl2 = item.url;
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

  formAbout = this.formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    titleSpan: [''],
    subtitle: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    btnText: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    desc: [''],
    para1: [''],
    para2: [''],
    para3: [''],
    titleTwo: [''],
    titleTwoSpan: [''],
  });

  async onEditSubmit() {
    if (this.formAbout.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.formAbout.disable;

      let title = this.formAbout.value.title;
      let titleSpan = this.formAbout.value.titleSpan;
      let subtitle = this.formAbout.value.subtitle;
      let btnLink = this.selectedBtnPageUrl;
      let btnText = this.formAbout.value.btnText;
      let desc = this.formAbout.value.desc;
      let para1 = this.formAbout.value.para1;
      let para2 = this.formAbout.value.para2;
      let para3 = this.formAbout.value.para3;
      let titleTwo = this.formAbout.value.titleTwo;
      let titleTwoSpan = this.formAbout.value.titleTwoSpan;

      let data = {
        title: title,
        titleSpan: titleSpan,
        subtitle: subtitle,
        btnLink: btnLink,
        btnText: btnText,
        desc: desc,
        para1: para1,
        para2: para2,
        para3: para3,
        titleTwo: titleTwo,
        titleTwoSpan: titleTwoSpan,
      };

      this.aboutService
        .update(this.sectionOneId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.formAbout.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.formAbout.enable;
        });
    }
  }

  async onSectionOneImageSubmit() {
    if (this.uploadedUrl == '') {
      this.toast.error(
        'Please select a valid image to upload.',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;

      let imageUrl = this.uploadedUrl;

      let data = {
        imageUrl: imageUrl,
      };

      this.aboutService
        .update(this.sectionOneId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.canUploadSectionOne = false;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
        });
    }
  }

  editItem(item: any) {
    this.canEdit = true;
    this.chosenItem = item;
  }

  qualificationForm = this.formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

  async submitQualification() {
    if (this.qualificationForm.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.qualificationForm.disable;

      let title = this.qualificationForm.value.title;

      let data = {
        title: title,
      };

      this.aboutService
        .addQualification(data)
        .then(() => {
          this.toast.success(
            'You have successfully added a new qualification.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.qualificationForm.enable;
          this.qualificationForm.reset();
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.qualificationForm.enable;
        });
    }
  }

  deleteQualification(id: any) {
    this.aboutService
      .deleteQualification(id)
      .then(() => {
        this.toast.success(
          'You have successfully deleted a qualification.',
          'Request Successful'
        );
      })
      .catch((error) => {
        console.log(error);
        this.isSubmitting = false;
      });
  }

  sectionCtaForm = this.formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    titleSpan: [''],
    desc: [''],
    para: [''],
    btnText: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

  async onSectionTwoSubmit() {
    if (this.sectionCtaForm.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.sectionCtaForm.disable;

      let title = this.sectionCtaForm.value.title;
      let titleSpan = this.sectionCtaForm.value.titleSpan;
      let btnLink = this.selectedBtnPageUrl2;
      let btnText = this.sectionCtaForm.value.btnText;
      let desc = this.sectionCtaForm.value.desc;
      let para = this.sectionCtaForm.value.para;

      let data = {
        title: title,
        titleSpan: titleSpan,
        btnLink: btnLink,
        btnText: btnText,
        desc: desc,
        para: para,
      };

      this.aboutService
        .update(this.sectionTwoId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.sectionCtaForm.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.sectionCtaForm.enable;
        });
    }
  }

  editSectionTwoItem(item: any) {
    this.canEditSectionTwo = true;
    this.chosenItemTwo = item;
  }

  updateTitle(value: string) {
    this.imageTitle = value;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
