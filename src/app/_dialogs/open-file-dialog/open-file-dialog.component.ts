import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService, cleanUpFilename, FileType} from 'sartography-workflow-lib';
import {OpenFileDialogData} from '../../_interfaces/dialog-data';
import { getDiagramTypeFromXml } from '../../_util/diagram-type';

@Component({
  selector: 'app-open-file-dialog',
  templateUrl: './open-file-dialog.component.html',
  styleUrls: ['./open-file-dialog.component.scss']
})
export class OpenFileDialogComponent {
  mode: string;
  url: string;
  fileTypes: FileType[];
  fileMetaId: number;

  constructor(
    public dialogRef: MatDialogRef<OpenFileDialogComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: OpenFileDialogData,
  ) {
    if (this.data) {
      this.mode = this.data.mode || undefined;
      this.fileTypes = this.data.fileTypes;
      this.fileMetaId = this.data.fileMetaId;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.data);
  }

  onFileSelected($event: Event) {
    this.data.file = ($event.target as HTMLFormElement).files[0];
  }

  getFileName() {
    return this.data.file ? this.data.file.name : 'Click to select a file';
  }

  onSubmitUrl() {
    if (this.url) {
      this.api.getStringFromUrl(this.url).subscribe(s => {
        const fileArray = this.url.split('/');
        const fileName = fileArray[fileArray.length - 1];
        const fileType = getDiagramTypeFromXml(s);
        const name = cleanUpFilename(fileName, fileType);
        this.data.file = new File([s], name, {type: 'text/xml'});
        this.onSubmit();
      });
    }
  }

  isValidUrl() {
    // eslint-disable-next-line max-len
    const re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    return re.test(this.url);
  }

  fileTypesString(): string {
    if (this.fileTypes && (this.fileTypes.length > 0)) {
      return this.fileTypes.map(t => t.toString().toUpperCase()).join('/');
    }
  }

  fileExtensions(): string {
    if (this.fileTypes && (this.fileTypes.length > 0)) {
      return this.fileTypes.map(t => '.' + t.toString()).join(',');
    }
  }

  cancel() {
    if (this.data.mode) {
      this.onNoClick();
    } else {
      this.mode = undefined;
    }
  }
}
