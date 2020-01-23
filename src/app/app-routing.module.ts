import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {ModelerComponent} from './modeler/modeler.component';
import {WorkflowSpecListComponent} from './workflow-spec-list/workflow-spec-list.component';


const appRoutes: Routes = [
  { path: 'modeler', component: ModelerComponent },
  { path: 'workflow-specs', component: WorkflowSpecListComponent },
  { path: '', redirectTo: '/workflow-specs', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
