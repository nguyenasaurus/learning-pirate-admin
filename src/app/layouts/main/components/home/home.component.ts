import { Component, OnInit } from '@angular/core';
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

  sectionTwo: HomeSectionTwo = {};
  sectionTwoId = 'sectionTwo';
  canEditSectionTwo = false;
  chosenItemTwo: any;

  sectionThree: HomeSectionThree = {};
  sectionThreeId = 'sectionThree';
  canEditSectionThree = false;
  chosenItemThree: any;

  sectionFour: HomeSectionFour = {};
  sectionFourId = 'sectionFour';
  canEditSectionFour = false;
  chosenItemFour: any;

  sectionFive: HomeSectionFive = {};
  sectionFiveId = 'sectionFive';
  canEditSectionFive = false;
  chosenItemFive: any;

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private homeService: HomeService,
    private userService: UserService
  ) {
    this.titleService.setTitle(this.page);
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    this.checkLevel();

    this.homeService.getById(this.sectionOneId).subscribe((res: Home) => {
      this.sectionOne = res;
    });

    this.homeService
      .getById(this.sectionTwoId)
      .subscribe((res: HomeSectionTwo) => {
        this.sectionTwo = res;
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
    imageUrl: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    btnLink: [
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
      let subtitle = this.formSlider.value.subtitle;
      let btnLink = this.formSlider.value.btnLink;
      let imageUrl = this.formSlider.value.imageUrl;
      let btnText = this.formSlider.value.btnText;

      let data = {
        title: title,
        subtitle: subtitle,
        imageUrl: imageUrl,
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

  editItem(item: any) {
    this.canEdit = true;
    this.chosenItem = item;
  }

  deleteItem(item: any) {
    this.selectedItem = item;
  }

  // async onDelete(id: string) {
  //   this.home.delete(id).then(() => {
  //     this.toast.success('Testimony deletion successful', 'Request Successful');
  //     window.location.reload();
  //   });
  // }

  sectionTwoForm = this.formBuilder.group({
    title: [
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
    btnText: [
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
    btnLink: [
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
      let subtitle = this.sectionTwoForm.value.subtitle;
      let btnLink = this.sectionTwoForm.value.btnLink;
      let imageUrl = this.sectionTwoForm.value.imageUrl;
      let btnText = this.sectionTwoForm.value.btnText;
      let desc = this.sectionTwoForm.value.desc;
      let para = this.sectionTwoForm.value.para;

      let data = {
        title: title,
        subtitle: subtitle,
        imageUrl: imageUrl,
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
    itemOneIcon: [
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
    itemTwoIcon: [
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
    itemThreeIcon: [
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

      let title = this.sectionThreeForm.value.title;
      let subtitle = this.sectionThreeForm.value.subtitle;
      let itemOneTitle = this.sectionThreeForm.value.itemOneTitle;
      let itemOneDesc = this.sectionThreeForm.value.itemOneDesc;
      let itemOneIcon = this.sectionThreeForm.value.itemOneIcon;
      let itemTwoTitle = this.sectionThreeForm.value.itemTwoTitle;
      let itemTwoDesc = this.sectionThreeForm.value.itemTwoDesc;
      let itemTwoIcon = this.sectionThreeForm.value.itemTwoIcon;
      let itemThreeTitle = this.sectionThreeForm.value.itemThreeTitle;
      let itemThreeDesc = this.sectionThreeForm.value.itemThreeDesc;
      let itemThreeIcon = this.sectionThreeForm.value.itemThreeIcon;

      let data = {
        title: title,
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
    desc: [
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
    btnLink: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
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
      let desc = this.sectionFourForm.value.desc;
      let btnText = this.sectionFourForm.value.btnText;
      let btnLink = this.sectionFourForm.value.btnLink;

      let data = {
        title: title,
        desc: desc,
        btnText: btnText,
        btnLink: btnLink,
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
    desc: [
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
      let desc = this.sectionFiveForm.value.desc;
      let btnText = this.sectionFiveForm.value.btnText;
      let subtitle = this.sectionFiveForm.value.subtitle;

      let data = {
        title: title,
        desc: desc,
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
}
