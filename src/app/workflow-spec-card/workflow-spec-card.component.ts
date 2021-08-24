import {Component, Input, TemplateRef} from '@angular/core';
import { WorkflowSpec} from 'sartography-workflow-lib';


@Component({
  selector: 'app-workflow-spec-card',
  templateUrl: './workflow-spec-card.component.html',
  styleUrls: ['./workflow-spec-card.component.scss']
})
export class WorkflowSpecCardComponent {
  @Input() workflowSpec: WorkflowSpec;
  @Input() actionButtons: TemplateRef<any>;
  showAll: boolean;
  constructor(
  ) {
  }
  expandToggle() {
    this.showAll = !this.showAll;
  }
}
