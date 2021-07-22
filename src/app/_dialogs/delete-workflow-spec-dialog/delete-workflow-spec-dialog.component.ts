import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeleteWorkflowSpecDialogData} from '../../_interfaces/dialog-data';

@Component({
  selector: 'app-delete-workflow-spec-dialog',
  templateUrl: './delete-workflow-spec-dialog.component.html',
  styleUrls: ['./delete-workflow-spec-dialog.component.scss']
})
export class DeleteWorkflowSpecDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteWorkflowSpecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteWorkflowSpecDialogData
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    const data: DeleteWorkflowSpecDialogData = {
      confirm: true,
      workflowSpec: this.data.workflowSpec,
    };
    this.dialogRef.close(data);
  }

}
