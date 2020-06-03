import {Component, Inject} from '@angular/core';
import {ApiService, AppEnvironment, GoogleAnalyticsService} from 'sartography-workflow-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'CR Connect Configuration';

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private apiService: ApiService,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.googleAnalyticsService.init(this.environment.googleAnalyticsKey);
  }

  get isSignedIn() {
    return this.apiService.isSignedIn();
  }
}
