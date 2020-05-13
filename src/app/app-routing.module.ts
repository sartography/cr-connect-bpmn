import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SessionRedirectComponent} from 'sartography-workflow-lib';
import {environment} from '../environments/environment.runtime';
import {HomeComponent} from './home/home.component';
import {ModelerComponent} from './modeler/modeler.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';


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
    path: 'modeler/:workflowSpecId',
    component: ModelerComponent
  },
  {
    path: 'modeler/:workflowSpecId/:fileMetaId',
    component: ModelerComponent
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'sign-out',
    component: SignOutComponent
  },
  {
    path: 'session/:token',
    component: SessionRedirectComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 84],
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
