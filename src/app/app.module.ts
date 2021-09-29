import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import {
  AppEnvironment,
  AuthInterceptor,
  ErrorInterceptor,
  SartographyFormsModule,
  SartographyPipesModule,
  SartographyWorkflowLibModule,
} from 'sartography-workflow-lib';
import { environment } from '../environments/environment.runtime';
import { DeleteFileDialogComponent } from './_dialogs/delete-file-dialog/delete-file-dialog.component';
import {
  DeleteWorkflowSpecCategoryDialogComponent
} from './_dialogs/delete-workflow-spec-category-dialog/delete-workflow-spec-category-dialog.component';
import { DeleteWorkflowSpecDialogComponent } from './_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import { FileMetaDialogComponent } from './_dialogs/file-meta-dialog/file-meta-dialog.component';
import { NewFileDialogComponent } from './_dialogs/new-file-dialog/new-file-dialog.component';
import { OpenFileDialogComponent } from './_dialogs/open-file-dialog/open-file-dialog.component';
import { WorkflowSpecCategoryDialogComponent } from './_dialogs/workflow-spec-category-dialog/workflow-spec-category-dialog.component';
import { WorkflowSpecDialogComponent } from './_dialogs/workflow-spec-dialog/workflow-spec-dialog.component';
import { GetIconCodePipe } from './_pipes/get-icon-code.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagramComponent } from './diagram/diagram.component';
import { FileListComponent } from './file-list/file-list.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ModelerComponent } from './modeler/modeler.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ReferenceFilesComponent } from './reference-files/reference-files.component';
import { WorkflowSpecCardComponent } from './workflow-spec-card/workflow-spec-card.component';
import { WorkflowSpecListComponent } from './workflow-spec-list/workflow-spec-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ConfirmDialogComponent } from './_dialogs/confirm-dialog/confirm-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SettingsComponent } from './settings/settings.component';
import { MatSelectModule } from '@angular/material/select';
import { LibraryListComponent } from './library-list/library-list.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateGitCheckpointDialogComponent } from './_dialogs/create-git-checkpoint-dialog/create-git-checkpoint-dialog.component';

@Injectable()
export class ThisEnvironment implements AppEnvironment {
  homeRoute = environment.homeRoute;
  production = environment.production;
  api = environment.api;
  irbUrl = environment.irbUrl;
  title = environment.title;
  googleAnalyticsKey = environment.googleAnalyticsKey;
  sentryKey = environment.sentryKey;
}

/**
 * This function is used internal to get a string instance of the `<base href="" />` value from `index.html`.
 * This is an exported function, instead of a private function or inline lambda, to prevent this error:
 *
 * `Error encountered resolving symbol values statically.`
 * `Function calls are not supported.`
 * `Consider replacing the function or lambda with a reference to an exported function.`
 *
 * @param platformLocation an Angular service used to interact with a browser's URL
 * @return a string instance of the `<base href="" />` value from `index.html`
 */
export const getBaseHref = (platformLocation: PlatformLocation): string => platformLocation.getBaseHrefFromDOM();

@NgModule({
  declarations: [
    AppComponent,
    DeleteFileDialogComponent,
    DeleteWorkflowSpecDialogComponent,
    DeleteWorkflowSpecCategoryDialogComponent,
    DiagramComponent,
    FileListComponent,
    FileMetaDialogComponent,
    FooterComponent,
    GetIconCodePipe,
    LibraryListComponent,
    ModelerComponent,
    NavbarComponent,
    NewFileDialogComponent,
    OpenFileDialogComponent,
    WorkflowSpecCategoryDialogComponent,
    WorkflowSpecDialogComponent,
    WorkflowSpecListComponent,
    HomeComponent,
    WorkflowSpecCardComponent,
    ReferenceFilesComponent,
    ConfirmDialogComponent,
    SettingsComponent,
    CreateGitCheckpointDialogComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FlexLayoutModule,
    FormlyModule,
    FormsModule,
    HttpClientModule,
    MatBottomSheetModule,
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
    MatSelectModule,
    ReactiveFormsModule,
    SartographyFormsModule,
    SartographyPipesModule,
    SartographyWorkflowLibModule,
    AppRoutingModule,
    MatSidenavModule,
    MatExpansionModule,
    MatCheckboxModule,
    // <-- This line MUST be last (https://angular.io/guide/router#module-import-order-matters)
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteFileDialogComponent,
    DeleteWorkflowSpecDialogComponent,
    DeleteWorkflowSpecCategoryDialogComponent,
    FileMetaDialogComponent,
    NewFileDialogComponent,
    OpenFileDialogComponent,
    WorkflowSpecCategoryDialogComponent,
    WorkflowSpecDialogComponent,
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: APP_BASE_HREF, useFactory: getBaseHref, deps: [PlatformLocation]},
  ],
})
export class AppModule {
}

