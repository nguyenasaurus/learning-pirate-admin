import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  user: any;
  uid: string = '';

  @Input() pages: any;
  @Input() page: any;

  profileMenu = [
    { icon: 'ri-user-line', title: 'View Profile', url: '/profile' },
    { icon: 'ri-settings-5-line', title: 'Profile Settings', url: '/settings' },
  ];

  isDarkTheme = false;
  isLightTheme = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // jQuery
    $(function () {
      // declare variables
      var $sideMenu = $('.g-sidenav-show');
      var $menuBtn = $('.sidenav-toggler-inner');
      const themeToggler = document.querySelector('.theme-toggler');

      // show sidebar
      $menuBtn.on('click', () => {
        $sideMenu.toggleClass('g-sidenav-pinned');
        $sideMenu.toggleClass('g-sidenav-hidden');
      });

      // toggle theme mode
      themeToggler?.addEventListener('click', () => {
        $('body').toggleClass('dark-version');

        themeToggler
          .querySelector('i:nth-child(1)')
          ?.classList.toggle('active');
        themeToggler
          .querySelector('i:nth-child(2)')
          ?.classList.toggle('active');
      });
    });

    let darkTheme = localStorage.getItem('darkTheme');

    if (darkTheme === 'true') {
      this.isDarkTheme = true;
      this.isLightTheme = false;
    } else {
      this.isDarkTheme = false;
      this.isLightTheme = true;
    }

    this.uid = localStorage.getItem('lpuid')!;

    if (this.uid != null) {
      this.fetchUserProfile(this.uid);
    }
  }

  // Set theme mode = light
  switchToLightTheme() {
    this.isLightTheme = true;
    this.isDarkTheme = false;
    localStorage.setItem('darkTheme', 'false');
    window.location.reload();
  }

  // set theme mode = dark
  switchToDarkTheme() {
    this.isDarkTheme = true;
    this.isLightTheme = false;
    localStorage.setItem('darkTheme', 'true');
    window.location.reload();
  }

  async fetchUserProfile(id: string) {
    await this.userService.getUserById(id).subscribe((result) => {
      this.user = result;
    });
  }

  signOut() {
    this.authService.signUserOut().subscribe(() => {
      this.router.navigate(['/sign-in']);
    });
  }
}
