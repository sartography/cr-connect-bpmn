
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-script-doc-dialog',
  templateUrl: './script-doc-dialog.component.html',
  styleUrls: ['./script-doc-dialog.component.scss']
})
export class ScriptDocDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<ScriptDocDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
  }
}
