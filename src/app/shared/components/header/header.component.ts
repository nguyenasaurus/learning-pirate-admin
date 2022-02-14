import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

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
  }
}
