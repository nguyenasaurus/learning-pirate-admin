import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import {
  Home,
  HomeSectionFive,
  HomeSectionFour,
  HomeSectionThree,
  HomeSectionTwo,
} from 'src/app/interfaces/home';
import { HomeService } from 'src/app/services/home.service';
import { UserService } from 'src/app/services/user.service';

import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders,
} from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  pages = [
    { url: '/', title: 'Dashboard' },
    { url: '/home', title: 'Home' },
  ];
  page = 'Home';

  selectedItem: any;
  chosenItem: any;

  uid: any;
  isAdmin = false;
  canEdit = false;
  isSubmitting = false;

  sectionOne: Home = {};
  sectionOneId = 'sectionOne';
  canEditSectionOne = false;
  canUploadSectionOne = false;

  sectionTwo: HomeSectionTwo = {};
  sectionTwoId = 'sectionTwo';
  canEditSectionTwo = false;
  chosenItemTwo: any;
  canUploadSectionTwo = false;

  sectionThree: HomeSectionThree = {};
  sectionThreeId = 'sectionThree';
  canEditSectionThree = false;
  canUploadSectionThree = false;
  chosenItemThree: any;

  sectionFour: HomeSectionFour = {};
  sectionFourId = 'sectionFour';
  canEditSectionFour = false;
  canUploadSectionFour = false;
  chosenItemFour: any;

  sectionFive: HomeSectionFive = {};
  sectionFiveId = 'sectionFive';
  canEditSectionFive = false;
  canUploadSectionFive = false;
  chosenItemFive: any;

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
  selectedBtnPage4 = '';
  selectedBtnPageUrl4 = '';

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private homeService: HomeService,
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

    this.homeService.getById(this.sectionOneId).subscribe((res: Home) => {
      this.sectionOne = res;
      this.selectedBtnPageUrl = res.btnLink!;
    });

    this.homeService
      .getById(this.sectionTwoId)
      .subscribe((res: HomeSectionTwo) => {
        this.sectionTwo = res;
        this.selectedBtnPageUrl2 = res.btnLink!;
      });

    this.homeService
      .getById(this.sectionThreeId)
      .subscribe((res: HomeSectionThree) => {
        this.sectionThree = res;
      });

    this.homeService
      .getById(this.sectionFourId)
      .subscribe((res: HomeSectionFour) => {
        this.sectionFour = res;
      });

    this.homeService
      .getById(this.sectionFiveId)
      .subscribe((res: HomeSectionFive) => {
        this.sectionFive = res;
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

  setActiveItem4(item: any) {
    this.selectedBtnPage4 = item.url;
    this.selectedBtnPageUrl4 = item.url;
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

  formSlider = this.formBuilder.group({
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
  });

  async onEditSubmit() {
    if (this.formSlider.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.formSlider.disable;

      let title = this.formSlider.value.title;
      let titleSpan = this.formSlider.value.titleSpan;
      let subtitle = this.formSlider.value.subtitle;
      let btnLink = this.selectedBtnPageUrl;
      let btnText = this.formSlider.value.btnText;

      let data = {
        title: title,
        titleSpan: titleSpan,
        subtitle: subtitle,
        btnLink: btnLink,
        btnText: btnText,
      };

      this.homeService
        .update(this.sectionOneId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.formSlider.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.formSlider.enable;
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

      this.homeService
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

  deleteItem(item: any) {
    this.selectedItem = item;
  }

  sectionTwoForm = this.formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    titleSpan: [''],
    btnText: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    desc: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    para: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

  async onSectionTwoSubmit() {
    if (this.sectionTwoForm.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.sectionTwoForm.disable;

      let title = this.sectionTwoForm.value.title;
      let titleSpan = this.sectionTwoForm.value.titleSpan;
      let btnLink = this.selectedBtnPageUrl2;
      let btnText = this.sectionTwoForm.value.btnText;
      let desc = this.sectionTwoForm.value.desc;
      let para = this.sectionTwoForm.value.para;

      let data = {
        title: title,
        titleSpan: titleSpan,
        btnLink: btnLink,
        btnText: btnText,
        desc: desc,
        para: para,
      };

      this.homeService
        .update(this.sectionTwoId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.sectionTwoForm.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.sectionTwoForm.enable;
        });
    }
  }

  async onSectionTwoImageSubmit() {
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

      this.homeService
        .update(this.sectionTwoId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.canUploadSectionTwo = false;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
        });
    }
  }

  editSectionTwoItem(item: any) {
    this.canEditSectionTwo = true;
    this.chosenItemTwo = item;
  }

  sectionThreeForm = this.formBuilder.group({
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
    itemOneTitle: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    itemOneDesc: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    itemTwoTitle: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    itemTwoDesc: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    itemThreeTitle: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    itemThreeDesc: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

  async onSectionThreeSubmit() {
    if (this.sectionThreeForm.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.sectionThreeForm.disable;

      let itemOneIcon =
        'https://firebasestorage.googleapis.com/v0/b/learning-pirate.appspot.com/o/bbb.svg?alt=media&token=6f97e5e5-66de-43bf-b7a0-ae0512928522';
      let itemTwoIcon =
        'https://firebasestorage.googleapis.com/v0/b/learning-pirate.appspot.com/o/ccc.svg?alt=media&token=a18563ee-1262-43b6-8c60-b9be47f8d116';
      let itemThreeIcon =
        'https://firebasestorage.googleapis.com/v0/b/learning-pirate.appspot.com/o/aaa.svg?alt=media&token=8955a41a-4a47-4900-8fc2-6ed314e544e1';

      let title = this.sectionThreeForm.value.title;
      let titleSpan = this.sectionThreeForm.value.titleSpan;
      let subtitle = this.sectionThreeForm.value.subtitle;
      let itemOneTitle = this.sectionThreeForm.value.itemOneTitle;
      let itemOneDesc = this.sectionThreeForm.value.itemOneDesc;
      let itemTwoTitle = this.sectionThreeForm.value.itemTwoTitle;
      let itemTwoDesc = this.sectionThreeForm.value.itemTwoDesc;
      let itemThreeTitle = this.sectionThreeForm.value.itemThreeTitle;
      let itemThreeDesc = this.sectionThreeForm.value.itemThreeDesc;

      let data = {
        title: title,
        titleSpan: titleSpan,
        subtitle: subtitle,
        itemOne: {
          title: itemOneTitle,
          desc: itemOneDesc,
          icon: itemOneIcon,
        },
        itemTwo: {
          title: itemTwoTitle,
          desc: itemTwoDesc,
          icon: itemTwoIcon,
        },
        itemThree: {
          title: itemThreeTitle,
          desc: itemThreeDesc,
          icon: itemThreeIcon,
        },
      };

      this.homeService
        .update(this.sectionThreeId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.sectionThreeForm.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.sectionThreeForm.enable;
        });
    }
  }

  editSectionThreeItem(item: any) {
    this.canEditSectionThree = true;
    this.chosenItemThree = item;
  }

  sectionFourForm = this.formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    titleSpan: [''],
  });

  async onSectionFourSubmit() {
    if (this.sectionFourForm.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.sectionFourForm.disable;

      let title = this.sectionFourForm.value.title;
      let titleSpan = this.sectionFourForm.value.titleSpan;

      let data = {
        title: title,
        titleSpan: titleSpan,
      };

      this.homeService
        .update(this.sectionFourId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.sectionFourForm.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.sectionFourForm.enable;
        });
    }
  }

  editSectionFourItem(item: any) {
    this.canEditSectionFour = true;
    this.chosenItemFour = item;
  }

  sectionFiveForm = this.formBuilder.group({
    title: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    titleSpan: [''],
    desc: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    para: [
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
    subtitle: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

  async onSectionFiveSubmit() {
    if (this.sectionFiveForm.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.sectionFiveForm.disable;

      let title = this.sectionFiveForm.value.title;
      let titleSpan = this.sectionFiveForm.value.titleSpan;
      let desc = this.sectionFiveForm.value.desc;
      let para = this.sectionFiveForm.value.para;
      let btnText = this.sectionFiveForm.value.btnText;
      let subtitle = this.sectionFiveForm.value.subtitle;

      let data = {
        title: title,
        titleSpan: titleSpan,
        desc: desc,
        para: para,
        btnText: btnText,
        subtitle: subtitle,
      };

      this.homeService
        .update(this.sectionFiveId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.sectionFiveForm.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.sectionFiveForm.enable;
        });
    }
  }

  editSectionFiveItem(item: any) {
    this.canEditSectionFive = true;
    this.chosenItemFive = item;
  }

  updateTitle(value: string) {
    this.imageTitle = value;
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
