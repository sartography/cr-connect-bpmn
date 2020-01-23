import { Component, OnInit } from '@angular/core';
import {ApiService, WorkflowSpec} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-spec-list',
  templateUrl: './workflow-spec-list.component.html',
  styleUrls: ['./workflow-spec-list.component.scss']
})
export class WorkflowSpecListComponent implements OnInit {
  workflowSpecs: WorkflowSpec[] = [];

  constructor(private api: ApiService) {
    this.api.getWorkflowSpecList().subscribe(wfs => this.workflowSpecs = wfs);
  }

  ngOnInit() {
  }

}
