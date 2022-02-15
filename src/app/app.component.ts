import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Learning Pirate Admin';

  ngOnInit(): void {
    // Check if local storage contains preferred theme mode
    let darkMode = false;
    let darkTheme = localStorage.getItem('darkTheme');

    if (darkTheme === 'true') {
      darkMode = true;
      document.body.classList.toggle('dark-version', darkMode);
    } else if (darkTheme != 'true') {
      darkMode = false;
      document.body.classList.toggle('dark-version', darkMode);
    } else {
      // Use systems default theme mode
      const isDark = window.matchMedia('(prefers-color-scheme: dark)');
      document.body.classList.toggle('dark-version', isDark.matches);
    }
  }
}
