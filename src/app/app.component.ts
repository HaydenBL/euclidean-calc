import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Euclidean Calculator';
  githubText = ' Github ';

  githubClicked(): void {
    window.open('https://github.com/HaydenBL/euclidean-calc', '_blank');
  }
}
