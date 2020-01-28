import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileMetaDialogData} from '../_interfaces/file-meta-dialog-data';
import {cleanUpFilename, toSnakeCase, trimString} from '../_util/string-clean';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './file-meta-dialog.component.html',
  styleUrls: ['./file-meta-dialog.component.scss']
})
export class FileMetaDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FileMetaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileMetaDialogData
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.fileName = cleanUpFilename(this.data.fileName, this.data.fileType);
    this.dialogRef.close(this.data);
  }

}
