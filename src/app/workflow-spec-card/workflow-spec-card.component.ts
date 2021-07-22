import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {ApiService, WorkflowSpec} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-spec-card',
  templateUrl: './workflow-spec-card.component.html',
  styleUrls: ['./workflow-spec-card.component.scss']
})
export class WorkflowSpecCardComponent implements OnInit {
  @Input() workflowSpec: WorkflowSpec;
  @Input() actionButtons: TemplateRef<any>;

  constructor(
    private api: ApiService
  ) {
  }

  ngOnInit(): void {
  }
}
