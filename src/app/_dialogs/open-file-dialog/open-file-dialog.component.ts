import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {ApiService, cleanUpFilename, getDiagramTypeFromXml} from 'sartography-workflow-lib';

@Component({
  selector: 'app-open-file-dialog',
  templateUrl: './open-file-dialog.component.html',
  styleUrls: ['./open-file-dialog.component.scss']
})
export class OpenFileDialogComponent {
  mode: string;
  diagramFile: File;
  url: string;

  constructor(
    public dialogRef: MatDialogRef<OpenFileDialogComponent>,
    private api: ApiService
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close({file: this.diagramFile});
  }

  onFileSelected($event: Event) {
    this.diagramFile = ($event.target as HTMLFormElement).files[0];
  }

  getFileName() {
    return this.diagramFile ? this.diagramFile.name : 'Click to select a file';
  }

  onSubmitUrl() {
    if (this.url) {
      this.api.getStringFromUrl(this.url).subscribe(s => {
        const fileArray = this.url.split('/');
        const fileName = fileArray[fileArray.length - 1];
        const fileType = getDiagramTypeFromXml(s);
        const name = cleanUpFilename(fileName, fileType);
        this.diagramFile = new File([s], name, {type: 'text/xml'});
        this.onSubmit();
      });
    }
  }

  isValidUrl() {
    // tslint:disable-next-line:max-line-length
    const re = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
    return re.test(this.url);
  }
}
