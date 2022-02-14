import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-checker',
  templateUrl: './input-checker.component.html',
  styleUrls: ['./input-checker.component.scss'],
})
export class InputCheckerComponent implements OnInit {
  @Input() checker: boolean = false;
  @Input() message: any;

  constructor() {}

  ngOnInit(): void {}
}
