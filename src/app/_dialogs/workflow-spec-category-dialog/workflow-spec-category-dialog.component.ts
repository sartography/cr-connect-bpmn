import {Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {toSnakeCase} from 'sartography-workflow-lib';
import {WorkflowSpecDialogData} from '../../_interfaces/dialog-data';

@Component({
  selector: 'app-workflow-spec-category-dialog',
  templateUrl: './workflow-spec-category-dialog.component.html',
  styleUrls: ['./workflow-spec-category-dialog.component.scss']
})
export class WorkflowSpecCategoryDialogComponent {
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'id',
      type: 'input',
      defaultValue: this.data.id,
      templateOptions: {
        label: 'ID',
        type: 'number',
        placeholder: 'ID of workflow spec category',
        required: true,
      },
    },
    {
      key: 'name',
      type: 'input',
      defaultValue: this.data.name,
      templateOptions: {
        label: 'Name',
        placeholder: 'Name of workflow spec category',
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
        placeholder: 'Title of the workflow spec category',
        description: 'This is a human-readable title for the workflow spec category,' +
          'which should be easy for others to read and remember.',
        required: true,
      },
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<WorkflowSpecCategoryDialogComponent>,
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
