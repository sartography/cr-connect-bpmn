import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ApiService, FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';
import {DeleteFileDialogComponent} from '../_dialogs/delete-file-dialog/delete-file-dialog.component';
import {DeleteFileDialogData} from '../_interfaces/dialog-data';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @Input() workflowSpec: WorkflowSpec;
  fileMetas: FileMeta[];
  fileType = FileType;

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this._loadFileMetas();
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
        this._deleteFile(data.fileMeta);
      }
    });
  }

  makePrimary(fmPrimary: FileMeta) {
    if (fmPrimary.type === FileType.BPMN) {
      let numUpdated = 0;
      this.fileMetas.forEach(fm => {
        fm.primary = (fmPrimary.id === fm.id);
        this.api.updateFileMeta(fm).subscribe(() => {
          numUpdated++;

          // Reload all fileMetas when all have been updated.
          if (numUpdated === this.fileMetas.length) {
            this._loadFileMetas();
          }
        });
      });
    }
  }

  private _deleteFile(fileMeta: FileMeta) {
    this.api.deleteFileMeta(fileMeta.id).subscribe(() => {
      this._loadFileMetas();
      this.snackBar.open(`Deleted file ${fileMeta.name}.`, 'Ok', {duration: 3000});
    });
  }

  private _loadFileMetas() {
    this.api.getFileMetas({workflow_spec_id: this.workflowSpec.id}).subscribe(fms => {
      this.fileMetas = fms;
      this._loadFileData();
    });
  }

  private _loadFileData() {
    this.fileMetas.forEach(fm => {
      this.api.getFileData(fm.id).subscribe((fd: File) => fm.file = fd);
    });
  }
}
