import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {ApiService, toSnakeCase} from 'sartography-workflow-lib';
import {WorkflowSpecCategoryDialogData} from '../../_interfaces/dialog-data';
import {of} from "rxjs";

@Component({
  selector: 'app-workflow-spec-category-dialog',
  templateUrl: './workflow-spec-category-dialog.component.html',
  styleUrls: ['./workflow-spec-category-dialog.component.scss']
})
export class WorkflowSpecCategoryDialogComponent {
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];
  categories: any;



  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<WorkflowSpecCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkflowSpecCategoryDialogData,
  ) {
    this.api.getWorkflowSpecCategoryList().subscribe(cats => {
      this.categories = cats.map(c => c.id);

      this.fields = [
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
          key: 'id',
          type: 'input',
          defaultValue: this.data.id,
          templateOptions: {
            label: 'ID',
            placeholder: 'Name of the category',
            description: 'Enter a name to identify this category. It cannot be changed later.' +
              'It will be converted to all_lowercase_with_underscores when you save.',
            required: true,
            disabled: this.data.id !== null,
            help: 'This must be in a universal format for XML standards. ' +
              'It can only contain letters, numbers, and underscores. ' +
              'It should not start with a digit.',
            modelOptions:
              {
                updateOn: 'focus',
              }
          },
          expressionProperties: {
            'model.id': (m, formState, field) => {
              if (!m.id && field.focus) {
                m.id = m.display_name.replace(/ /g,"_").toLowerCase();
                field.formControl.markAsDirty();
                return m.id;
              } else {
                return m.id;
              }
            },
            'templateOptions.change': (m, formState, field)=> {
              if (field.focus) {
                field.formControl.updateValueAndValidity();
              }
            },
          },
          asyncValidators: {
            uniqueID: {
              expression: (control: FormControl) => {

                return of(this.categories.indexOf(control.value) === -1);
              },
              message: 'This ID name is already taken.',
            },
          },
          validators: {
             formatter: {
               expression: (c) => !c.value || /^[A-Za-z_][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$/.test(c.value),
               message: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" is not in a valid format.`,
              },
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
        },
      ];
    });
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
