import {APP_BASE_HREF} from '@angular/common';
import {Injectable, NgModule} from '@angular/core';
import {ExtraOptions, RouterModule, Routes} from '@angular/router';
import {AppEnvironment, SessionRedirectComponent} from 'sartography-workflow-lib';
import {environment} from '../environments/environment.runtime';
import {HomeComponent} from './home/home.component';
import {ModelerComponent} from './modeler/modeler.component';
import {ReferenceFilesComponent} from './reference-files/reference-files.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';
import {SettingsComponent} from './settings/settings.component';

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

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: environment.homeRoute,
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'home/:spec',
    component: WorkflowSpecListComponent
  },
  {
    path: 'reffiles',
    component: ReferenceFilesComponent
  },
  {
    path: 'modeler/:workflowSpecId',
    component: ModelerComponent
  },
  {
    path: 'modeler/:workflowSpecId/file/:fileMetaName',
    component: ModelerComponent
  },
  {
    path: 'session',
    component: SessionRedirectComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 84],
    relativeLinkResolution: 'legacy'
})
  ],
  exports: [RouterModule],
  providers: [
    {provide: 'APP_ENVIRONMENT', useClass: ThisEnvironment},
    // {provide: APP_BASE_HREF, useValue: environment.baseHref},
  ]
})
export class AppRoutingModule {
}
