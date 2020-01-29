import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ApiService, FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';
import {DeleteFileDialogData} from '../_interfaces/dialog-data';
import {DeleteFileDialogComponent} from '../_dialogs/delete-file-dialog/delete-file-dialog.component';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @Input() workflowSpec: WorkflowSpec;
  fileMetas: FileMeta[];

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.loadFileMetas();
  }

  deleteFile(fileMeta: FileMeta) {
    this.api.deleteFileMeta(fileMeta.id).subscribe(() => {
      this.loadFileMetas();
      this.snackBar.open(`Deleted file ${fileMeta.name}.`, 'Ok', {duration: 3000});
    });
  }

  private loadFileMetas() {
    this.api.listBpmnFiles(this.workflowSpec.id).subscribe(fms => this.fileMetas = fms);
  }

  editFile(fileMetaId: number) {
    this.router.navigate([`/modeler/${this.workflowSpec.id}/${fileMetaId}`]);
  }

  confirmDelete(fm: FileMeta) {
    const dialogRef = this.dialog.open(DeleteFileDialogComponent, {
      data: {
        confirm: false,
        fileMeta: fm,
      }
    });

    dialogRef.afterClosed().subscribe((data: DeleteFileDialogData) => {
      if (data && data.confirm && data.fileMeta) {
        this.deleteFile(data.fileMeta);
      }
    });
  }
}
