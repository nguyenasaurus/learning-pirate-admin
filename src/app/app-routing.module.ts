import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './layouts/auth/auth.component';
import { ForgotPasswordComponent } from './layouts/auth/components/forgot-password/forgot-password.component';
import { SignInComponent } from './layouts/auth/components/sign-in/sign-in.component';
import { SignUpComponent } from './layouts/auth/components/sign-up/sign-up.component';
import { VerifyEmailComponent } from './layouts/auth/components/verify-email/verify-email.component';
import { DashboardComponent } from './layouts/main/components/dashboard/dashboard.component';
import { MainComponent } from './layouts/main/main.component';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { SettingsComponent } from './layouts/main/components/settings/settings.component';
import { ProfileComponent } from './layouts/main/components/profile/profile.component';
import { HomeComponent } from './layouts/main/components/home/home.component';
import { AboutComponent } from './layouts/main/components/about/about.component';
import { LearningDesignComponent } from './layouts/main/components/learning-design/learning-design.component';
import { SpeakingComponent } from './layouts/main/components/speaking/speaking.component';
import { MembersComponent } from './layouts/main/components/members/members.component';
import { PodcastsComponent } from './layouts/main/components/podcasts/podcasts.component';
import { ConferencesComponent } from './layouts/main/components/conferences/conferences.component';
import { ArticlesComponent } from './layouts/main/components/articles/articles.component';
import { TestimonialComponent } from './layouts/main/components/testimonial/testimonial.component';
import { SignedInComponent } from './layouts/auth/components/signed-in/signed-in.component';
import { WebinarsComponent } from './layouts/main/components/webinars/webinars.component';
import { BoardOfDirectorComponent } from './layouts/main/components/board-of-director/board-of-director.component';
import { GalleryComponent } from './layouts/main/components/gallery/gallery.component';

const redirectToLogin = () => redirectUnauthorizedTo(['sign-in']);

const redirectToHome = () => redirectLoggedInTo(['']);

const routes: Routes = [
  {
    path: '',
    ...canActivate(redirectToLogin),
    component: MainComponent,
    children: [
      {
        path: '',
        ...canActivate(redirectToLogin),
        component: HomeComponent,
      },
      {
        path: 'home',
        ...canActivate(redirectToLogin),
        component: HomeComponent,
      },
      {
        path: 'profile',
        ...canActivate(redirectToLogin),
        component: ProfileComponent,
      },
      {
        path: 'settings',
        ...canActivate(redirectToLogin),
        component: SettingsComponent,
      },
      {
        path: 'about',
        ...canActivate(redirectToLogin),
        component: AboutComponent,
      },
      {
        path: 'learning-design',
        ...canActivate(redirectToLogin),
        component: LearningDesignComponent,
      },
      {
        path: 'speaking',
        ...canActivate(redirectToLogin),
        component: SpeakingComponent,
      },
      {
        path: 'members',
        ...canActivate(redirectToLogin),
        component: MembersComponent,
      },
      {
        path: 'podcasts',
        ...canActivate(redirectToLogin),
        component: PodcastsComponent,
      },
      {
        path: 'conference',
        ...canActivate(redirectToLogin),
        component: ConferencesComponent,
      },
      {
        path: 'articles',
        ...canActivate(redirectToLogin),
        component: ArticlesComponent,
      },
      {
        path: 'webinars',
        ...canActivate(redirectToLogin),
        component: WebinarsComponent,
      },
      {
        path: 'testimonials',
        ...canActivate(redirectToLogin),
        component: TestimonialComponent,
      },
      {
        path: 'bods',
        ...canActivate(redirectToLogin),
        component: BoardOfDirectorComponent,
      },
      {
        path: 'gallery',
        ...canActivate(redirectToLogin),
        component: GalleryComponent,
      },
    ],
  },
  {
    path: '',
    component: AuthComponent,
    ...canActivate(redirectToHome),
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
        ...canActivate(redirectToHome),
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
        ...canActivate(redirectToHome),
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        ...canActivate(redirectToHome),
      },
      {
        path: 'signed-in',
        component: SignedInComponent,
        ...canActivate(redirectToHome),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
