import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {MatDialogRef} from "@angular/material/dialog";
import {ApiService} from 'sartography-workflow-lib';


@Component({
  selector: 'app-git-repo-dialog',
  templateUrl: './git-repo-dialog.component.html',
  styleUrls: ['./git-repo-dialog.component.scss']
})
export class GitRepoDialogComponent {
  form: FormGroup = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<GitRepoDialogComponent>,
  ) {

    this.api.gitRepo().subscribe(data => {
      let mockChanges = ['file1', 'file2']

      this.fields = [
        {
          key: 'changed',
          type: 'select',
          templateOptions: {
            multiple: true,
            label: 'These are the changed files',
            rows: 5,
            options: this.listify(mockChanges),
          }
        }
      ]
    });
  }

  listify(list: string[]) {
    let dict = []
    for (let item in list) {
      dict.push({label: list[item], value: item});
    }
    return dict;
  }

  onNoClick() {
    console.log('form model : ', this.model);
    this.dialogRef.close();
  }

  onSubmit() {
    // I think all we actually will return here is the comment
    this.dialogRef.close(this.model);
  }

}
