import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeleteFileDialogData} from '../../_interfaces/dialog-data';

@Component({
  selector: 'app-delete-file-dialog',
  templateUrl: './delete-file-dialog.component.html',
  styleUrls: ['./delete-file-dialog.component.scss']
})
export class DeleteFileDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteFileDialogData
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    const data: DeleteFileDialogData = {
      confirm: true,
      fileMeta: this.data.fileMeta,
    };
    this.dialogRef.close(data);
  }

}
