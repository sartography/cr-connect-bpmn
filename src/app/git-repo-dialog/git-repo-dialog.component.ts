import { Component, OnInit } from '@angular/core';
import {UntypedFormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {MatDialogRef} from "@angular/material/dialog";
import {ApiService} from 'sartography-workflow-lib';


@Component({
  selector: 'app-git-repo-dialog',
  templateUrl: './git-repo-dialog.component.html',
  styleUrls: ['./git-repo-dialog.component.scss']
})
export class GitRepoDialogComponent {
  form: UntypedFormGroup = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<GitRepoDialogComponent>,
  ) {

    this.api.gitRepo().subscribe(data => {
      // Delete and replace with data.changes
      let mockChanges = ['file1', 'file2', 'file3', 'file4', 'file5', 'file6']

      this.fields = [
        {
          key: 'changed',
          type: 'textarea',
          defaultValue: this.listify(data.modified),
          templateOptions: {
            label: 'These are the changed files',
            rows: 4,
            readonly: true,
          }
        },
        {
          key: 'deleted',
          type: 'textarea',
          defaultValue: this.listify(data.deleted),
          templateOptions: {
            label: 'These are the deleted files',
            rows: 4,
            readonly: true,
          }
        },
        {
          key: 'untracked',
          type: 'textarea',
          defaultValue: this.listify(data.untracked),
          templateOptions: {
            label: 'These are the untracked files. ',
            rows: 4,
            readonly: true,
          }
        },
        {
          key: 'comment',
          type:'input',
          templateOptions: {
            label: 'Enter a comment for this commit: '
          }
        }
      ]
    });
  }

  dictify(list: string[]) {
    let dict = [];
    for (let item in list) {
      dict.push({label: list[item], value: item});
    }
    return dict;
  }

  listify(list: string[]) {
    let str = '';
    for (let item in list) {
      str += list[item] + '\n';
    }
    return str;
  }

  onNoClick() {
    console.log('form model : ', this.model);
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.model);
  }

}
