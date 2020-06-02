import {Component} from '@angular/core';
import {ApiService, GoogleAnalyticsService} from 'sartography-workflow-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CR Connect Configuration';

  constructor(
    private apiService: ApiService,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.googleAnalyticsService.init();
  }

  get isSignedIn() {
    return this.apiService.isSignedIn();
  }
}
