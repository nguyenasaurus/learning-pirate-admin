import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import {
  LdProcesses,
  LearningNeedSectionOne,
  LearningNeedSectionTwo,
} from 'src/app/interfaces/learning-need';
import { LearningNeedsService } from 'src/app/services/learning-needs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-learning-design',
  templateUrl: './learning-design.component.html',
  styleUrls: ['./learning-design.component.scss'],
})
export class LearningDesignComponent implements OnInit {
  pages = [
    { url: '/', title: 'Dashboard' },
    { url: '/learning-design', title: 'Learning Design' },
  ];
  page = 'Learning Design';

  selectedItem: any;
  chosenItem: any;

  uid: any;
  isAdmin = false;
  canEdit = false;
  isSubmitting = false;

  sectionOne: LearningNeedSectionOne = {};
  sectionOneId = 'sectionOne';
  canEditSectionOne = false;

  sectionTwo: LearningNeedSectionTwo = {};
  sectionTwoId = 'sectionTwo';
  canEditSectionTwo = false;
  chosenItemTwo: any;

  selectedBtnPage = '';
  selectedBtnPageUrl = '';

  btnPages = [
    { title: 'Contact Me', url: '/contact-me' },
    { title: 'Membership', url: '/membership' },
  ];
  processes: LdProcesses[] = [];
  canAddProcess = false;
  selectedProcess: LdProcesses = {};

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private learningDesignsService: LearningNeedsService,
    private userService: UserService
  ) {
    this.titleService.setTitle(this.page);
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    this.checkLevel();

    this.learningDesignsService
      .getById(this.sectionOneId)
      .subscribe((res: LearningNeedSectionOne) => {
        this.sectionOne = res;
      });

    this.learningDesignsService
      .getById(this.sectionTwoId)
      .subscribe((res: LearningNeedSectionTwo) => {
        this.sectionTwo = res;
        this.selectedBtnPageUrl = res.btnLink!;
      });

    this.learningDesignsService
      .getProcesses()
      .subscribe((res: LdProcesses[]) => {
        this.processes = res;
      });
  }

  editProcess(item: any) {
    this.canAddProcess = true;
    this.selectedProcess = item;
  }

  formProcess = this.formBuilder.group({
    title: [''],
    desc: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    para: [''],
    position: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
  });

  async onEditProcess() {
    if (this.formProcess.invalid) {
      this.toast.error(
        'Please provide valid data. Remember all fields are required',
        'Request Denied'
      );
      return;
    } else {
      this.isSubmitting = true;
      this.formProcess.disable;

      let title = this.formProcess.value.title;
      let position = this.formProcess.value.position;
      let desc = this.formProcess.value.desc;
      let para = this.formProcess.value.para;

      let data = {
        title: title,
        desc: desc,
        para: para,
        position: position,
      };

      this.learningDesignsService
        .updateLearningDesign(this.selectedProcess.id!, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated learning design.',
            'Request Successful'
          );
          this.isSubmitting = false;
          this.formProcess.enable;
        })
        .catch((error) => {
          console.log(error);
          this.isSubmitting = false;
          this.formProcess.enable;
        });
    }
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
    author: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    jobTitle: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    quote: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    para1: [''],
    para2: [''],
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

      let author = this.formOne.value.author;
      let jobTitle = this.formOne.value.jobTitle;
      let quote = this.formOne.value.quote;
      let para1 = this.formOne.value.para1;
      let para2 = this.formOne.value.para2;

      let data = {
        author: author,
        quote: quote,
        para2: para2,
        para1: para1,
        jobTitle: jobTitle,
      };

      this.learningDesignsService
        .update(this.sectionOneId, data)
        .then(() => {
          this.toast.success(
            'You have successfully updated learning design.',
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

  setActiveItem(item: any) {
    this.selectedBtnPage = item.url;
    this.selectedBtnPageUrl = item.url;
  }

  formTwo = this.formBuilder.group({
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

      let title = this.formTwo.value.title;
      let titleSpan = this.formTwo.value.titleSpan;
      let btnLink = this.selectedBtnPageUrl;
      let btnText = this.formTwo.value.btnText;
      let desc = this.formTwo.value.desc;

      let data = {
        title: title,
        titleSpan: titleSpan,
        btnLink: btnLink,
        btnText: btnText,
        desc: desc,
      };

      this.learningDesignsService
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
}
