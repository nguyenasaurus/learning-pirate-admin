import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { About, AboutCta } from 'src/app/interfaces/about';
import { AboutService } from 'src/app/services/about.service';
import { UserService } from 'src/app/services/user.service';

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

  sectionTwo: AboutCta = {};
  sectionTwoId = 'sectionCta';
  canEditSectionTwo = false;
  chosenItemTwo: any;

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private aboutService: AboutService,
    private userService: UserService
  ) {
    this.titleService.setTitle(this.page);
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    this.checkLevel();

    this.aboutService.getById(this.sectionOneId).subscribe((res: About) => {
      this.sectionOne = res;
    });

    this.aboutService.getById(this.sectionTwoId).subscribe((res: AboutCta) => {
      this.sectionTwo = res;
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

  formAbout = this.formBuilder.group({
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
    titleTwo: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
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
      let subtitle = this.formAbout.value.subtitle;
      let btnLink = this.formAbout.value.btnLink;
      let imageUrl = this.formAbout.value.imageUrl;
      let btnText = this.formAbout.value.btnText;
      let desc = this.formAbout.value.desc;
      let titleTwo = this.formAbout.value.titleTwo;

      let data = {
        title: title,
        subtitle: subtitle,
        imageUrl: imageUrl,
        btnLink: btnLink,
        btnText: btnText,
        desc: desc,
        titleTwo: titleTwo,
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

  editItem(item: any) {
    this.canEdit = true;
    this.chosenItem = item;
  }

  sectionCtaForm = this.formBuilder.group({
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
      let btnLink = this.sectionCtaForm.value.btnLink;
      let btnText = this.sectionCtaForm.value.btnText;
      let desc = this.sectionCtaForm.value.desc;

      let data = {
        title: title,
        btnLink: btnLink,
        btnText: btnText,
        desc: desc,
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
}
