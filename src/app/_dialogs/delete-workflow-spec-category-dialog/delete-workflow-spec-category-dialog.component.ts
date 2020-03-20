import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeleteWorkflowSpecCategoryDialogData} from '../../_interfaces/dialog-data';

@Component({
  selector: 'app-delete-workflow-spec-dialog',
  templateUrl: './delete-workflow-spec-category-dialog.component.html',
  styleUrls: ['./delete-workflow-spec-category-dialog.component.scss']
})
export class DeleteWorkflowSpecCategoryDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteWorkflowSpecCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteWorkflowSpecCategoryDialogData
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    const data: DeleteWorkflowSpecCategoryDialogData = {
      confirm: true,
      category: this.data.category,
    };
    this.dialogRef.close(data);
  }

}
