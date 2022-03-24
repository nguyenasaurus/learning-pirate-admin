import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  pageMenu = [
    { icon: 'ri-home-line', title: 'Home', url: '/home' },
    { icon: 'ri-suitcase-line', title: 'About', url: '/about' },
    {
      icon: 'ri-pencil-ruler-line',
      title: 'Learning Design',
      url: '/learning-design',
    },
    { icon: 'ri-group-line', title: 'Board Members', url: '/bods' },
    { icon: 'ri-mic-2-line', title: 'Speaking', url: '/speaking' },
    { icon: 'ri-group-line', title: 'Registered Members', url: '/members' },
    { icon: 'ri-volume-up-line', title: 'Testimonials', url: '/testimonials' },
  ];

  mediaMenu = [
    { icon: 'ri-image-line', title: 'Gallery', url: '/gallery' },
    // { icon: 'ri-vidicon-2-line', title: 'Conferences', url: '/conference' },
    // { icon: 'ri-voiceprint-line', title: 'Articles', url: '/articles' },
    // { icon: 'ri-voiceprint-line', title: 'Webinars', url: '/webinars' },
  ];

  accountMenu = [
    { icon: 'ri-user-line', title: 'Profile', url: '/profile' },
    { icon: 'ri-settings-5-line', title: 'Settings', url: '/settings' },
  ];

  user: any;
  uid: string = '';

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uid = localStorage.getItem('lpuid')!;

    if (this.uid != null) {
      this.fetchUserProfile(this.uid);
    }
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
