import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService, WorkflowSpec} from 'sartography-workflow-lib';

@Component({
  selector: 'app-workflow-spec-card',
  templateUrl: './workflow-spec-card.component.html',
  styleUrls: ['./workflow-spec-card.component.scss']
})
export class WorkflowSpecCardComponent implements OnInit {
  @Input() workflowSpec: WorkflowSpec;
  @Input() actionButtons: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

  openFileDialog() {


  }
}
