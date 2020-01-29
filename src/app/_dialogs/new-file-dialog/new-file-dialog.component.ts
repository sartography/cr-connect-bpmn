import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FileType} from 'sartography-workflow-lib';
import {NewFileDialogData} from '../../_interfaces/dialog-data';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './new-file-dialog.component.html',
  styleUrls: ['./new-file-dialog.component.scss']
})
export class NewFileDialogComponent {
  mode: string;
  fileType = FileType;

  constructor(
    public dialogRef: MatDialogRef<NewFileDialogComponent>
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit(fileType: FileType) {
    const data: NewFileDialogData = {fileType: fileType};
    this.dialogRef.close(data);
  }

}
