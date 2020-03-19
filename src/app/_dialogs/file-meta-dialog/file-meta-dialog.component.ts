import {Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FileType} from 'sartography-workflow-lib';
import {FileMetaDialogData} from '../../_interfaces/dialog-data';
import {cleanUpFilename} from '../../_util/string-clean';

@Component({
  selector: 'app-new-file-dialog',
  templateUrl: './file-meta-dialog.component.html',
  styleUrls: ['./file-meta-dialog.component.scss']
})
export class FileMetaDialogComponent {
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    public dialogRef: MatDialogRef<FileMetaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileMetaDialogData
  ) {
      const fileTypeOptions = Object.entries(FileType).map(ft => {
        return {
          label: ft[0],
          value: ft[1]
        };
      });

      this.fields = [
        {
          key: 'id',
          type: 'input',
          defaultValue: this.data.id,
          templateOptions: {
            hide: true,
          },
        },
        {
          key: 'fileName',
          type: 'input',
          defaultValue: this.data.fileName,
          templateOptions: {
            label: 'File Name',
            placeholder: 'Name of workflow specification',
            description: 'Enter a name, in lowercase letters, separated by underscores, that is easy for you to remember.' +
              'It will be converted to all_lowercase_with_underscores when you save.',
            required: true,
          },
        },
        {
          key: 'fileType',
          type: 'select',
          defaultValue: this.data.fileType,
          templateOptions: {
            label: 'File Type',
            placeholder: 'Extension of file',
            required: true,
            options: fileTypeOptions,
          },
        },
        {
          key: 'file',
          type: 'file',
          defaultValue: this.data.file,
          templateOptions: {
            label: 'File',
            required: true,
          },
        }
      ];
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.fileName = cleanUpFilename(this.data.fileName, this.data.fileType);
    this.dialogRef.close(this.data);
  }

}
