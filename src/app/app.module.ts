import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppEnvironment} from 'sartography-workflow-lib';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DiagramComponent} from './diagram/diagram.component';
import {FileMetaDialogComponent} from './file-meta-dialog/file-meta-dialog.component';
import {ModelerComponent} from './modeler/modeler.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import { FileListComponent } from './file-list/file-list.component';

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
    FileMetaDialogComponent,
    ModelerComponent,
    WorkflowSpecListComponent,
    FileListComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatCardModule,
    MatListModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [FileMetaDialogComponent],
  providers: [{provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment}]
})
export class AppModule {
}
