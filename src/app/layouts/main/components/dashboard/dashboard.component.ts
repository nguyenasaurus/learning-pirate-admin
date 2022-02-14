import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  doc,
  docData,
  DocumentReference,
  CollectionReference,
  Firestore,
  onSnapshot,
  query,
  where,
  Unsubscribe,
  Query,
  DocumentData,
  collectionData,
  collectionChanges,
  docSnapshots,
  setDoc,
} from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  list = [
    {
      icon: 'ri-line-chart-line',
      title: 'Total Sales',
      amount: 25500,
      percentage: 81,
      timeAgo: 'Last 24 Hours',
      dashArray: 200,
      dashOffset: -30,
    },
    {
      icon: 'ri-line-chart-line',
      title: 'Total Expense',
      amount: 5000,
      percentage: 25,
      timeAgo: 'Last 5 Hours',
      dashArray: 80,
      dashOffset: 20,
    },
    {
      icon: 'ri-line-chart-line',
      title: 'Total Income',
      amount: 30500,
      percentage: 71,
      timeAgo: 'Last 20 Hours',
      dashArray: 110,
      dashOffset: 35,
    },
  ];

  user$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
}
