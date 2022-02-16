import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../../../sartography-libraries/dist/sartography-workflow-lib";
import {MatDialogRef} from "@angular/material/dialog";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";

@Component({
  selector: 'app-git-merge-dialog',
  templateUrl: './git-merge-dialog.component.html',
  styleUrls: ['./git-merge-dialog.component.scss']
})
export class GitMergeDialogComponent {
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<GitMergeDialogComponent>,
  ) {
    this.api.gitRepo().subscribe(gitRepo => {
      this.fields = [
         {
          key: 'your_branch',
          type: 'textarea',
          defaultValue: gitRepo.branch,
          templateOptions: {
            label: 'This is your branch',
            rows: 1,
            readonly: true,
          }
        },
        {
          key: 'merge_branch',
          type: 'textarea',
          defaultValue: gitRepo.merge_branch,
          templateOptions: {
            label: 'This is the merge branch',
            rows: 1,
            readonly: gitRepo.merge_branch != 'all',
          }
        },
      ]

    });

  }
  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.model);
  }

}
