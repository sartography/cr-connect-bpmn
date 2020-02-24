import {Component} from '@angular/core';
import {isSignedIn} from 'sartography-workflow-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CR Connect Configuration';
  isSignedIn = isSignedIn;
}
