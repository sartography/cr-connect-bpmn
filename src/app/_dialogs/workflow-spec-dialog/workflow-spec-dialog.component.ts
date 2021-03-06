import {Component, Inject} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions, FormlyTemplateOptions} from '@ngx-formly/core';
import {ApiService, toSnakeCase} from 'sartography-workflow-lib';
import {v4 as uuidv4} from 'uuid';
import {WorkflowSpecDialogData} from '../../_interfaces/dialog-data';

@Component({
  selector: 'app-workflow-spec-dialog',
  templateUrl: './workflow-spec-dialog.component.html',
  styleUrls: ['./workflow-spec-dialog.component.scss']
})
export class WorkflowSpecDialogComponent {
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  categories: any;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<WorkflowSpecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowSpecDialogData,
  ) {
    this.api.getWorkflowSpecCategoryList().subscribe(cats => {
      this.categories = cats.map(c => {
        return {
          value: c.id,
          label: c.display_name,
        };
      });

      this.fields = [
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
          key: 'category_id',
          type: 'select',
          defaultValue: this.data.category_id,
          templateOptions: {
            label: 'Category',
            placeholder: 'Category of workflow specification',
            required: true,
            options: this.categories
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
        {
          key: 'display_order',
          type: 'input',
          defaultValue: this.data.display_order,
          templateOptions: {
            type: 'number',
            label: 'Display Order',
            placeholder: 'Order in which spec will be displayed',
            description: 'Sort order that the spec should appear in within its category. Lower numbers will appear first.',
            required: true,
          },
        },
      ];
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.model.name = toSnakeCase(this.model.name);
    this.dialogRef.close(this.model);
  }

}
