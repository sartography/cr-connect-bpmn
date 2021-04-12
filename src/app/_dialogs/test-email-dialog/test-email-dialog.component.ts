import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-test-email-dialog',
  templateUrl: './test-email-dialog.component.html',
  styleUrls: ['./test-email-dialog.component.scss']
})
export class TestEmailDialogComponent  {

  constructor(
    public dialogRef: MatDialogRef<TestEmailDialogComponent>
  ) {
  }
}
