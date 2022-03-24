import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './layouts/auth/auth.module';
import { MainModule } from './layouts/main/main.module';
import { SharedModule } from './shared/shared.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { HotToastModule } from '@ngneat/hot-toast';
import {
  CloudinaryConfiguration,
  CloudinaryModule,
} from '@cloudinary/angular-5.x';
import * as Cloudinary from 'cloudinary-core';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AuthModule,
    MainModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      preventDuplicates: true,
      progressBar: true,
    }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    HotToastModule.forRoot(),
    CloudinaryModule.forRoot(Cloudinary, {
      cloud_name: 'theoakcapital',
      upload_preset: 'tocadmin',
    }),
    FileUploadModule,
  ],
  providers: [Title],
  bootstrap: [AppComponent],
})
export class AppModule {}
