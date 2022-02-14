import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  pageMenu = [
    { icon: 'ri-dashboard-line', title: 'Dashboard', url: '/dashboard' },
    { icon: 'ri-suitcase-line', title: 'About', url: '/about' },
    {
      icon: 'ri-pencil-ruler-line',
      title: 'Learning Design',
      url: '/learning-design',
    },
    { icon: 'ri-mic-2-line', title: 'Speaking', url: '/speaking' },
    { icon: 'ri-group-line', title: 'Registered Members', url: '/members' },
  ];

  mediaMenu = [
    { icon: 'ri-mic-line', title: 'Podcasts', url: '/podcast' },
    { icon: 'ri-vidicon-2-line', title: 'Conferences', url: '/conference' },
    { icon: 'ri-voiceprint-line', title: 'Articles', url: '/articles' },
  ];

  accountMenu = [
    { icon: 'ri-user-line', title: 'Profile', url: '/profile' },
    { icon: 'ri-settings-5-line', title: 'Settings', url: '/settings' },
  ];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  signOut() {
    this.authService.signUserOut().subscribe(() => {
      this.router.navigate(['/sign-in']);
    });
  }
}
