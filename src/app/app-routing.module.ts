import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SessionRedirectComponent} from 'sartography-workflow-lib';
import {ModelerComponent} from './modeler/modeler.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SignOutComponent} from './sign-out/sign-out.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';


const appRoutes: Routes = [
  {path: 'modeler/:workflowSpecId', component: ModelerComponent},
  {path: 'modeler/:workflowSpecId/:fileMetaId', component: ModelerComponent},
  {path: '', component: WorkflowSpecListComponent},
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
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
