import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Injectable, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
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
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {AppEnvironment, AuthInterceptor, SartographyWorkflowLibModule} from 'sartography-workflow-lib';
import {environment} from '../environments/environment';
import {DeleteFileDialogComponent} from './_dialogs/delete-file-dialog/delete-file-dialog.component';
import {DeleteWorkflowSpecDialogComponent} from './_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import {FileMetaDialogComponent} from './_dialogs/file-meta-dialog/file-meta-dialog.component';
import {NewFileDialogComponent} from './_dialogs/new-file-dialog/new-file-dialog.component';
import {OpenFileDialogComponent} from './_dialogs/open-file-dialog/open-file-dialog.component';
import {WorkflowSpecDialogComponent} from './_dialogs/workflow-spec-dialog/workflow-spec-dialog.component';
import {EmailValidator, EmailValidatorMessage, ShowError} from './_forms/validators/formly.validator';
import {GetIconCodePipe} from './_pipes/get-icon-code.pipe';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DiagramComponent} from './diagram/diagram.component';
import {FileListComponent} from './file-list/file-list.component';
import {FooterComponent} from './footer/footer.component';
import {HomeComponent} from './home/home.component';
import {ModelerComponent} from './modeler/modeler.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';

@Injectable()
export class ThisEnvironment implements AppEnvironment {
  production = environment.production;
  api = environment.api;
  googleAnalyticsKey = environment.googleAnalyticsKey;
  irbUrl = environment.irbUrl;
}

@Injectable()
export class AppFormlyConfig {
  public static config = {
    extras: {
      showError: ShowError,
    },
    validators: [
      {name: 'email', validation: EmailValidator},
    ],
    validationMessages: [
      {name: 'email', message: EmailValidatorMessage},
      {name: 'required', message: 'This field is required.'},
    ],
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DeleteFileDialogComponent,
    DeleteWorkflowSpecDialogComponent,
    DiagramComponent,
    FileListComponent,
    FileMetaDialogComponent,
    FooterComponent,
    GetIconCodePipe,
    ModelerComponent,
    NavbarComponent,
    NewFileDialogComponent,
    OpenFileDialogComponent,
    SignInComponent,
    SignOutComponent,
    WorkflowSpecDialogComponent,
    WorkflowSpecListComponent,
    HomeComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormlyMaterialModule,
    FormlyModule.forRoot(AppFormlyConfig.config),
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    SartographyWorkflowLibModule,
    AppRoutingModule, // <-- This line MUST be last (https://angular.io/guide/router#module-import-order-matters)
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteFileDialogComponent,
    DeleteWorkflowSpecDialogComponent,
    FileMetaDialogComponent,
    NewFileDialogComponent,
    OpenFileDialogComponent,
    WorkflowSpecDialogComponent,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ]
})
export class AppModule {
}
