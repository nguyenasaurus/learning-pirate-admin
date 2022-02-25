import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Testimonial } from 'src/app/interfaces/testimonial';
import { TestimonialService } from 'src/app/services/testimonial.service';
import { UserService } from 'src/app/services/user.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private toast: ToastrService,
    private testimonialService: TestimonialService,
    private userService: UserService
  ) {
    this.titleService.setTitle(this.page);
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
    imageUrl: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    company: [
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
      let imageUrl = this.form.value.imageUrl;
      let company = this.form.value.company;

      let data = {
        title: title,
        testimony: testimony,
        imageUrl: imageUrl,
        company: company,
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
      let imageUrl = this.form.value.imageUrl;
      let company = this.form.value.company;

      let data = {
        title: title,
        testimony: testimony,
        imageUrl: imageUrl,
        company: company,
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
}
