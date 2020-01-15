import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppEnvironment} from 'sartography-workflow-lib';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {DiagramComponent} from './diagram/diagram.component';
import { NewFileDialogComponent } from './new-file-dialog/new-file-dialog.component';

class ThisEnvironment implements AppEnvironment {
  production = environment.production;
  api = environment.api;
  googleAnalyticsKey = environment.googleAnalyticsKey;
  irbUrl = environment.irbUrl;
}

@NgModule({
  declarations: [
    AppComponent,
    DiagramComponent,
    NewFileDialogComponent
  ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSnackBarModule,
        MatTabsModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatDividerModule,
        MatTooltipModule,
    ],
  bootstrap: [AppComponent],
  entryComponents: [NewFileDialogComponent],
  providers: [{provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment}]
})
export class AppModule {
}
