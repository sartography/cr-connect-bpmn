import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NewFileDialogData} from '../_interfaces/new-file-dialog-data';
import {toSnakeCase} from '../_util/snake-case';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.scss']
})
export class NewFileDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<NewFileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NewFileDialogData
  ) {
  }

  onNoClick() {
    this.dialogRef.close(this.data);
  }

  onSubmit() {
    this.data.workflowSpecId = toSnakeCase(this.data.workflowSpecId);
    this.data.fileName = this._cleanUpFilename(this.data.fileName);
    this.dialogRef.close(this.data);
  }

  private _cleanUpFilename(old: string): string {
    const arr = old.trim().split('.');

    // Add file extension, if necessary
    if (arr.length < 2) {
      arr.push('bpmn');
    } else {
      (arr[arr.length - 1]) = 'bpmn';
    }

    return arr.join('.');
  }
}
