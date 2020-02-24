import {Component} from '@angular/core';
import {isSignedIn} from 'sartography-workflow-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isSignedIn = isSignedIn;

  constructor() {
  }

}
