import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Euclidean Calculator';
  githubText = ' Github ';

  githubClicked(): void {
    window.open('https://github.com/Ashanmaril/euclidean-calc', '_blank');
  }
}
