import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions, FormlyTemplateOptions} from '@ngx-formly/core';
import {ApiService, toSnakeCase} from 'sartography-workflow-lib';
import {v4 as uuidv4} from 'uuid';
import {WorkflowSpecDialogData} from '../../_interfaces/dialog-data';
import {of} from "rxjs";


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
  specs: any;

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<WorkflowSpecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowSpecDialogData,
  ) {
    this.api.getWorkflowSpecCategoryList().subscribe(cats => {
      this.categories = cats.map(c => ({
          value: c.id,
          label: c.display_name,
        }));

    this.api.getWorkflowSpecList().subscribe(wfs => {
      this.specs = wfs.map(w => w.id);

      this.fields = [
        {
          key: 'id',
          type: 'input',
          defaultValue: this.data.id,
          templateOptions: {
            label: 'id',
            placeholder: 'Name of workflow specification',
            description: 'Enter a name to identify this spec. It cannot be changed later.' +
              'It will be converted to all_lowercase_with_underscores when you save.',
            required: true,
            disabled: this.data.id !== '',
          },
          asyncValidators: {
            uniqueID: {
              expression: (control: FormControl) => {
                return of(this.specs.indexOf(control.value) === -1);
              },
              message: 'This ID name is already taken.',
            },
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
          key: 'standalone',
          type: 'checkbox',
          defaultValue: this.data.standalone ? this.data.standalone : false,
          templateOptions: {
            label: 'Standalone',
            description: 'Is this a standalone workflow?',
            indeterminate: false,
          },
        },
        {
          key: 'library',
          type: 'checkbox',
          defaultValue: this.data.library ? this.data.library : false,
          templateOptions: {
            label: 'Library',
            description: 'Is this a library workflow?',
            indeterminate: false,
          },
        },
      ];
    });
  });
  }

  onNoClick() {
    console.log('form model : ', this.model);
    this.dialogRef.close();
  }

  onSubmit() {
    this.model.name = toSnakeCase(this.model.name);
    this.dialogRef.close(this.model);
  }

}
