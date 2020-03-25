import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {cleanUpFilename, FileType} from 'sartography-workflow-lib';
import {FileMetaDialogData} from '../../_interfaces/dialog-data';

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
        key: 'fileName',
        type: 'input',
        defaultValue: this.data.fileName,
        templateOptions: {
          label: 'File Name',
          placeholder: 'Name of file',
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
        modelOptions: {
          updateOn: 'change'
        },
      }
    ];
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.model.fileName = cleanUpFilename(this.model.fileName, this.model.fileType);
    this.dialogRef.close(this.model);
  }

  onModelChange(model: any) {
    console.log('model', model);
    if (model.file && typeof model.file === 'object' && model.file instanceof Blob) {
      // Upload file
      const fileReader = new (window as any).FileReader();
      fileReader.onload = (event: ProgressEvent) => {
        const stringContent = (event.target as FileReader).result.toString();
        console.log(stringContent);
      };
      fileReader.readAsText(model.file);
    }
  }
}
