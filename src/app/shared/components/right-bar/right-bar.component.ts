import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.scss'],
})
export class RightBarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  signOut(): void {
    this.authService.signUserOut();
  }
}
