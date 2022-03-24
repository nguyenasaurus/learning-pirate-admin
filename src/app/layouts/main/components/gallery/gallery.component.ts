import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

import {
  FileUploader,
  FileUploaderOptions,
  ParsedResponseHeaders,
} from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { Bod } from 'src/app/interfaces/bod';
import { BodService } from 'src/app/services/bod.service';
import { Gallery } from 'src/app/interfaces/about';
import { AboutService } from 'src/app/services/about.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  pages = [
    { url: '/gallery', title: 'Media' },
    { url: '/gallery', title: 'Gallery' },
  ];
  page = 'Gallery';

  gallery: Gallery[] = [];

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
    private galleryService: AboutService,
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

    this.galleryService.getGallery().subscribe((res: Gallery[]) => {
      this.gallery = res;
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

  async onSubmit() {
    this.isSubmitting = true;

    let imageUrl = this.uploadedUrl;

    let data = {
      imageUrl: imageUrl,
    };

    this.galleryService
      .addGallery(data)
      .then(() => {
        this.toast.success(
          'You have successfully added an image.',
          'Request Successful'
        );
        this.isSubmitting = false;
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        this.isSubmitting = false;
      });
  }

  deleteItem(item: any) {
    this.selectedItem = item;
  }

  async onDelete(id: string) {
    this.galleryService.deleteGallery(id).then(() => {
      this.toast.success('Image deletion successful', 'Request Successful');
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
