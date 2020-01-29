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
        this._upsertSpecAndFileMeta(data);
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

  private _upsertSpecAndFileMeta(data: WorkflowSpecDialogData) {
    if (data.id && data.name && data.display_name && data.description) {

      // Save old workflow spec id, if user wants to change it
      const specId = this.selectedSpec ? this.selectedSpec.id : undefined;

      const newSpec: WorkflowSpec = {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
      };

      if (specId) {
        // Update existing workflow spec and file
        this.api.updateWorkflowSpecification(specId, newSpec).subscribe(spec => {
          this.snackBar.open('Saved changes to workflow spec.', 'Ok', {duration: 3000});
          this._loadWorkflowSpecs();
        });
      } else {
        // Add new workflow spec and file
        this.api.addWorkflowSpecification(newSpec).subscribe(spec => {
          this.snackBar.open('Saved new workflow spec.', 'Ok', {duration: 3000});
          this._loadWorkflowSpecs();
        });
      }
    }
  }

  private _deleteWorkflowSpec(workflowSpec: WorkflowSpec) {
    this.api.deleteWorkflowSpecification(workflowSpec.id).subscribe(() => {
      this._loadWorkflowSpecs();
      this.snackBar.open(`Deleted workflow spec ${workflowSpec.name}.`, 'Ok', {duration: 3000});
    });
  }
}
