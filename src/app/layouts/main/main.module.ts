import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsComponent } from './components/settings/settings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DataTablesModule } from 'angular-datatables';
import { ArticlesComponent } from './components/articles/articles.component';
import { ConferencesComponent } from './components/conferences/conferences.component';
import { PodcastsComponent } from './components/podcasts/podcasts.component';
import { MembersComponent } from './components/members/members.component';
import { SpeakingComponent } from './components/speaking/speaking.component';
import { LearningDesignComponent } from './components/learning-design/learning-design.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { WebinarsComponent } from './components/webinars/webinars.component';

import {
  CloudinaryConfiguration,
  CloudinaryModule,
} from '@cloudinary/angular-5.x';
import * as Cloudinary from 'cloudinary-core';

import { FileUploadModule } from 'ng2-file-upload';
import { BoardOfDirectorComponent } from './components/board-of-director/board-of-director.component';
import { GalleryComponent } from './components/gallery/gallery.component';

@NgModule({
  declarations: [
    MainComponent,
    DashboardComponent,
    SettingsComponent,
    ProfileComponent,
    ArticlesComponent,
    ConferencesComponent,
    PodcastsComponent,
    MembersComponent,
    SpeakingComponent,
    LearningDesignComponent,
    AboutComponent,
    HomeComponent,
    TestimonialComponent,
    WebinarsComponent,
    BoardOfDirectorComponent,
    GalleryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTablesModule.forRoot(),
    CloudinaryModule.forRoot(Cloudinary, {
      cloud_name: 'theoakcapital',
      upload_preset: 'tocadmin',
    }),
    FileUploadModule,
  ],
})
export class MainModule {}
