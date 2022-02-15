import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TopComponent } from './components/top/top.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { InputCheckerComponent } from './components/input-checker/input-checker.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    TopComponent,
    RightBarComponent,
    InputCheckerComponent,
    BreadcrumbComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  exports: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    TopComponent,
    RightBarComponent,
    InputCheckerComponent,
    BreadcrumbComponent,
  ],
})
export class SharedModule {}
