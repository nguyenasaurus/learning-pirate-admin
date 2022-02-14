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
        component: DashboardComponent,
      },
      {
        path: 'dashboard',
        ...canActivate(redirectToLogin),
        component: DashboardComponent,
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
        path: 'verify-email',
        component: VerifyEmailComponent,
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
