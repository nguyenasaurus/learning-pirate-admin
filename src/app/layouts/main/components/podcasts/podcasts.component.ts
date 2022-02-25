import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Podcast } from 'src/app/interfaces/podcast';
import { PodcastService } from 'src/app/services/podcast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.component.html',
  styleUrls: ['./podcasts.component.scss'],
})
export class PodcastsComponent implements OnInit {
  pages = [
    { url: '/podcast', title: 'Media' },
    { url: '/podcast', title: 'Podcasts' },
  ];
  page = 'Podcasts';

  podcasts: Podcast[] = [];

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
    private podcastService: PodcastService,
    private userService: UserService
  ) {
    this.titleService.setTitle(this.page);
  }

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    this.checkLevel();

    this.podcastService.getPodcasts().subscribe((res: Podcast[]) => {
      this.podcasts = res;
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
    author: [
      '',
      {
        validators: [Validators.required],
        updateOn: 'change',
      },
    ],
    duration: [
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

      let author = this.form.value.author;
      let title = this.form.value.title;
      let description = this.form.value.description;
      let imageUrl = this.form.value.imageUrl;
      let publishedOn = this.form.value.publishedOn;
      let url = this.form.value.url;
      let duration = this.form.value.duration;

      let data = {
        author: author,
        title: title,
        description: description,
        imageUrl: imageUrl,
        publishedOn: publishedOn,
        url: url,
        duration: duration,
      };

      this.podcastService
        .create(data)
        .then(() => {
          this.toast.success(
            'You have successfully added a new podcast.',
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
    this.isSubmitting = true;
    this.form.disable;

    let author = this.form.value.author;
    let title = this.form.value.title;
    let description = this.form.value.description;
    let imageUrl = this.form.value.imageUrl;
    let publishedOn = this.form.value.publishedOn;
    let url = this.form.value.url;
    let duration = this.form.value.duration;

    let data = {
      author: author,
      title: title,
      description: description,
      imageUrl: imageUrl,
      publishedOn: publishedOn,
      duration: duration,
      url: url,
    };

    this.podcastService
      .update(this.chosenItem.id, data)
      .then(() => {
        this.toast.success(
          'You have successfully updated a podcast.',
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

  editItem(item: any) {
    this.canEdit = true;
    this.chosenItem = item;
  }

  deleteItem(item: any) {
    this.selectedItem = item;
  }

  async onDelete(id: string) {
    this.podcastService.delete(id).then(() => {
      this.toast.success('Item deletion successful', 'Request Successful');
      window.location.reload();
    });
  }
}
