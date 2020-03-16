import {Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {v4 as uuidv4} from 'uuid';
import {WorkflowSpecDialogData} from '../../_interfaces/dialog-data';
import {toSnakeCase} from '../../_util/string-clean';

@Component({
  selector: 'app-workflow-spec-dialog',
  templateUrl: './workflow-spec-dialog.component.html',
  styleUrls: ['./workflow-spec-dialog.component.scss']
})
export class WorkflowSpecDialogComponent {
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'id',
      type: 'input',
      defaultValue: this.data.id || uuidv4(),
      templateOptions: {
        label: 'ID',
        placeholder: 'UUID of workflow specification',
        description: 'This is an autogenerated unique ID and is not editable.',
        required: true,
        disabled: true,
      },
    },
    {
      key: 'name',
      type: 'input',
      defaultValue: this.data.name,
      templateOptions: {
        label: 'Name',
        placeholder: 'Name of workflow specification',
        description: 'Enter a name, in lowercase letters, separated by underscores, that is easy for you to remember.' +
          'It will be converted to all_lowercase_with_underscores when you save.',
        required: true,
      },
    },
    {
      key: 'display_name',
      type: 'input',
      defaultValue: this.data.display_name,
      templateOptions: {
        label: 'Display Name',
        placeholder: 'Title of the workflow specification',
        description: 'This is a human-readable title for the workflow specification,' +
          'which should be easy for others to read and remember.',
        required: true,
      },
    },
    {
      key: 'description',
      type: 'textarea',
      defaultValue: this.data.description,
      templateOptions: {
        label: 'Description',
        placeholder: 'Description of workflow specification',
        description: 'Write a few sentences explaining to users why this workflow exists and what it should be used for.',
        required: true,
      },
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<WorkflowSpecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowSpecDialogData,
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.model.name = toSnakeCase(this.model.name);
    this.dialogRef.close(this.model);
  }

}
