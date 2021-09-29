import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {toSnakeCase} from 'sartography-workflow-lib';


@Component({
  selector: 'app-create-git-checkpoint-dialog',
  templateUrl: './create-git-checkpoint-dialog.component.html',
  styleUrls: ['./create-git-checkpoint-dialog.component.scss']
})
export class CreateGitCheckpointDialogComponent {

  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'commit_message',
      type: 'input',
      defaultValue: "Checkpoint",
      templateOptions: {
        label: 'Commit Message',
        placeholder: 'Please add a meaningful commit message',
        description: 'Enter a message that will be helpful to you in the future so that you can remember the context ',
        required: true,
      },
    },
  ];

  constructor(  public dialogRef: MatDialogRef<CreateGitCheckpointDialogComponent>){

  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.model.name = toSnakeCase(this.model.name);
    this.dialogRef.close(this.model);
  }




}
