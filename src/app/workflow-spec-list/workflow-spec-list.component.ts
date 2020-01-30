import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService, WorkflowSpec} from 'sartography-workflow-lib';
import {DeleteWorkflowSpecDialogComponent} from '../_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import {WorkflowSpecDialogComponent} from '../_dialogs/workflow-spec-dialog/workflow-spec-dialog.component';
import {DeleteWorkflowSpecDialogData, WorkflowSpecDialogData} from '../_interfaces/dialog-data';

@Component({
  selector: 'app-workflow-spec-list',
  templateUrl: './workflow-spec-list.component.html',
  styleUrls: ['./workflow-spec-list.component.scss']
})
export class WorkflowSpecListComponent implements OnInit {
  workflowSpecs: WorkflowSpec[] = [];
  selectedSpec: WorkflowSpec;

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this._loadWorkflowSpecs();
  }

  ngOnInit() {
  }

  editWorkflowSpec(selectedSpec?: WorkflowSpec) {
    this.selectedSpec = selectedSpec;

    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(WorkflowSpecDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: {
        id: this.selectedSpec ? this.selectedSpec.id : '',
        name: this.selectedSpec ? this.selectedSpec.name || this.selectedSpec.id : '',
        display_name: this.selectedSpec ? this.selectedSpec.display_name : '',
        description: this.selectedSpec ? this.selectedSpec.description : '',
      },
    });

    dialogRef.afterClosed().subscribe((data: WorkflowSpecDialogData) => {
      if (data && data.id && data.name && data.display_name && data.description) {
        this._upsertWorkflowSpecification(data);
      }
    });
  }

  confirmDeleteWorkflowSpec(wfs: WorkflowSpec) {
    const dialogRef = this.dialog.open(DeleteWorkflowSpecDialogComponent, {
      data: {
        confirm: false,
        workflowSpec: wfs,
      }
    });

    dialogRef.afterClosed().subscribe((data: DeleteWorkflowSpecDialogData) => {
      if (data && data.confirm && data.workflowSpec) {
        this._deleteWorkflowSpec(data.workflowSpec);
      }
    });
  }

  private _loadWorkflowSpecs() {
    this.api.getWorkflowSpecList().subscribe(wfs => {
      this.workflowSpecs = wfs;
    });
  }

  private _upsertWorkflowSpecification(data: WorkflowSpecDialogData) {
    if (data.id && data.name && data.display_name && data.description) {

      // Save old workflow spec id, in case it's changed
      const specId = this.selectedSpec ? this.selectedSpec.id : undefined;

      const newSpec: WorkflowSpec = {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
      };

      if (specId) {
        this._updateWorkflowSpec(specId, newSpec);
      } else {
        this._addWorkflowSpec(newSpec);
      }
    }
  }

  private _updateWorkflowSpec(specId: string, newSpec: WorkflowSpec) {
    this.api.updateWorkflowSpecification(specId, newSpec).subscribe(spec => {
      this._loadWorkflowSpecs();
      this._displayMessage('Saved changes to workflow spec.');
    });
  }

  private _addWorkflowSpec(newSpec: WorkflowSpec) {
    this.api.addWorkflowSpecification(newSpec).subscribe(spec => {
      this._loadWorkflowSpecs();
      this._displayMessage('Saved new workflow spec.');
    });
  }

  private _deleteWorkflowSpec(workflowSpec: WorkflowSpec) {
    this.api.deleteWorkflowSpecification(workflowSpec.id).subscribe(() => {
      this._loadWorkflowSpecs();
      this._displayMessage(`Deleted workflow spec ${workflowSpec.name}.`);
    });
  }

  private _displayMessage(message: string) {
    this.snackBar.open(message, 'Ok', {duration: 3000});
  }
}

