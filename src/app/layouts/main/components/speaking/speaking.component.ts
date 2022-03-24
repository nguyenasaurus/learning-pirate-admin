import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import {
  LearningNeedSectionOne,
  LearningNeedSectionTwo,
} from 'src/app/interfaces/learning-need';
import {
  SpeakingSectionFour,
  SpeakingSectionOne,
  SpeakingSectionThree,
  SpeakingSectionTwo,
} from 'src/app/interfaces/speaking';
import { SpeakingService } from 'src/app/services/speaking.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-speaking',
  templateUrl: './speaking.component.html',
  styleUrls: ['./speaking.component.scss'],
})
export class SpeakingComponent implements OnInit {
  pages = [
    { url: '/', title: 'Dashboard' },
    { url: '/speaking', title: 'Speaking' },
  ];
  page = 'Speaking';

  selectedItem: any;
  chosenItem: any;

  uid: any;
  isAdmin = false;
  canEdit = false;
  isSubmitting = false;

  sectionOne: SpeakingSectionOne = {};
  sectionOneId = 'seactionOne';
  canEditSectionOne = false;

  sectionTwo: SpeakingSectionTwo = {};
  sectionTwoId = 'sectionTwo';
  canEditSectionTwo = false;
  chosenItemTwo: any;

  sectionThree: SpeakingSectionThree = {};
  sectionThreeId = 'secctionThree';
  canEditSectionThree = false;
  chosenItemThree: any;

  sectionFour: SpeakingSectionFour = {};
  sectionFourId = 'sectionFour';
  canEditSectionFour = false;
  chosenItemFour: any;

  selectedBtnPage = '';
  selectedBtnPageUrl = '';
  selectedBtnPageUrl2 = '';
  selectedBtnPageUrl3 = '';
  selectedBtnPageUrl4 = '';

  btnPages = [
    { title: 'Contact Me', url: '/contact-me' },
    { title: 'Membership', url: '/membership' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private speakingService: SpeakingService,
    private userService: UserService
  ) {
    this.titleService.setTitle(this.page);
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    this.checkLevel();

    this.speakingService
      .getById(this.sectionOneId)
      .subscribe((res: SpeakingSectionOne) => {
        this.sectionOne = res;
        this.selectedBtnPageUrl = res.btnLink!;
      });

    this.speakingService
      .getById(this.sectionTwoId)
      .subscribe((res: SpeakingSectionTwo) => {
        this.sectionTwo = res;
        this.selectedBtnPageUrl2 = res.btnLink!;
      });

    this.speakingService
      .getById(this.sectionThreeId)
      .subscribe((res: SpeakingSectionThree) => {
        this.sectionThree = res;
        this.selectedBtnPageUrl3 = res.btnLink!;
      });

    this.speakingService
      .getById(this.sectionFourId)
      .subscribe((res: SpeakingSectionFour) => {
        this.sectionFour = res;
        this.selectedBtnPageUrl4 = res.btnLink!;
      });
  }

  setActiveItem(item: any) {
    this.selectedBtnPage = item.url;
    this.selectedBtnPageUrl = item.url;
  }

  setActiveItem2(item: any) {
    this.selectedBtnPage = item.url;
    this.selectedBtnPageUrl2 = item.url;
  }

  setActiveItem3(item: any) {
    this.selectedBtnPage = item.url;
    this.selectedBtnPageUrl3 = item.url;
  }

  setActiveItem4(item: any) {
    this.selectedBtnPage = item.url;
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

  formOne = this.formBuilder.group({
    header: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    headerSpan: [
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
    titleSpan: [
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
    desc2: [''],
    desc3: [''],
    btnText: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

  async onEditSubmit() {
    if (this.formOne.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.formOne.disable;

      let header = this.formOne.value.header;
      let headerSpan = this.formOne.value.headerSpan;
      let title = this.formOne.value.title;
      let titleSpan = this.formOne.value.titleSpan;
      let desc = this.formOne.value.desc;
      let desc2 = this.formOne.value.desc2;
      let desc3 = this.formOne.value.desc3;
      let btnText = this.formOne.value.btnText;
      let btnLink = this.selectedBtnPageUrl;

      let data = {
        header: header,
        headerSpan: headerSpan,
        title: title,
        titleSpan: titleSpan,
        desc: desc,
        desc2: desc2,
        desc3: desc3,
        btnText: btnText,
        btnLink: btnLink,
      };

      this.speakingService
        .update(this.sectionOneId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.formOne.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.formOne.enable;
        });
    }
  }

  editItem(item: any) {
    this.canEdit = true;
    this.chosenItem = item;
  }

  formTwo = this.formBuilder.group({
    header: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    headerSpan: [
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
    titleSpan: [
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
    par: [
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

  async onSectionTwoSubmit() {
    if (this.formTwo.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.formTwo.disable;

      let header = this.formTwo.value.header;
      let headerSpan = this.formTwo.value.headerSpan;
      let title = this.formTwo.value.title;
      let titleSpan = this.formTwo.value.titleSpan;
      let desc = this.formTwo.value.desc;
      let par = this.formTwo.value.par;
      let btnText = this.formTwo.value.btnText;
      let btnLink = this.selectedBtnPageUrl2;

      let data = {
        header: header,
        headerSpan: headerSpan,
        title: title,
        titleSpan: titleSpan,
        desc: desc,
        par: par,
        btnText: btnText,
        btnLink: btnLink,
      };

      this.speakingService
        .update(this.sectionTwoId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.formTwo.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.formTwo.enable;
        });
    }
  }

  editSectionTwoItem(item: any) {
    this.canEditSectionTwo = true;
    this.chosenItemTwo = item;
  }

  formThree = this.formBuilder.group({
    subtitle: [
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
    par: [
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

  async onSectionThreeSubmit() {
    if (this.formThree.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.formThree.disable;

      let subtitle = this.formThree.value.subtitle;
      let par = this.formThree.value.par;
      let title = this.formThree.value.title;
      let btnText = this.formThree.value.btnText;
      let btnLink = this.selectedBtnPageUrl3;

      let data = {
        subtitle: subtitle,
        title: title,
        par: par,
        btnText: btnText,
        btnLink: btnLink,
      };

      this.speakingService
        .update(this.sectionThreeId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.formThree.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.formThree.enable;
        });
    }
  }

  editSectionThreeItem(item: any) {
    this.canEditSectionThree = true;
    this.chosenItemThree = item;
  }

  formFour = this.formBuilder.group({
    subtitle: [
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
    par: [
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

  async onSectionFourSubmit() {
    if (this.formFour.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.formFour.disable;

      let subtitle = this.formFour.value.subtitle;
      let title = this.formFour.value.title;
      let par = this.formFour.value.par;
      let btnText = this.formFour.value.btnText;
      let btnLink = this.selectedBtnPageUrl4;

      let data = {
        subtitle: subtitle,
        par: par,
        title: title,
        btnText: btnText,
        btnLink: btnLink,
      };

      this.speakingService
        .update(this.sectionFourId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated a home section.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.formFour.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.formFour.enable;
        });
    }
  }

  editSectionFourItem(item: any) {
    this.canEditSectionFour = true;
    this.chosenItemFour = item;
  }
}
