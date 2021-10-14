import {Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {toSnakeCase} from 'sartography-workflow-lib';
import {WorkflowSpecCategoryDialogData} from '../../_interfaces/dialog-data';

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
      hideExpression: true,
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
    {
      key: 'admin',
      type: 'checkbox',
      defaultValue: this.data.admin ? this.data.admin : false,
      templateOptions: {
        label: 'Admin Category',
        description: 'Should this category only be shown to Admins?',
        indeterminate: false,
      }
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<WorkflowSpecCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowSpecCategoryDialogData,
  ) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log('data is ', this.model);
    this.model.name = toSnakeCase(this.model.name);
    this.dialogRef.close(this.model);
  }

}
