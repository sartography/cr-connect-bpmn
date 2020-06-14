import {Component, Inject} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer, Title} from '@angular/platform-browser';
import {AppEnvironment, FileType, GoogleAnalyticsService} from 'sartography-workflow-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private titleService: Title,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private googleAnalyticsService: GoogleAnalyticsService,
  ) {
    this.googleAnalyticsService.init(this.environment.googleAnalyticsKey);
    const fileTypes = Object.values(FileType);
    fileTypes.forEach(t => {
      const url = this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/file_types/${t}.svg`)
      this.matIconRegistry.addSvgIconInNamespace('crc', t, url);
    });
    this.titleService.setTitle(this.environment.title);
  }
}
