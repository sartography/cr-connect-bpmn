import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApiService,
  FileMeta,
  FileParams,
  FileType,
  getFileType,
  isNumberDefined,
  newFileFromResponse,
  WorkflowSpec,
} from 'sartography-workflow-lib';
import { DeleteFileDialogComponent } from '../_dialogs/delete-file-dialog/delete-file-dialog.component';
import { OpenFileDialogComponent } from '../_dialogs/open-file-dialog/open-file-dialog.component';
import { DeleteFileDialogData, OpenFileDialogData } from '../_interfaces/dialog-data';
import * as fileSaver from 'file-saver';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit, OnChanges {
  @Input() workflowSpec: WorkflowSpec;
  fileMetas: FileMeta[];
  fileType = FileType;

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this._loadFileMetas();
  }

  ngOnChanges() {
    this._loadFileMetas();
  }

  editFile(fileMeta?: FileMeta) {
    if (fileMeta && ((fileMeta.type === FileType.BPMN) || (fileMeta.type === FileType.DMN))) {
      this.router.navigate([`/modeler/${this.workflowSpec.id}/${fileMeta.id}`]);
    } else {
      // Show edit file meta dialog
      this.editFileMeta(fileMeta);
    }
  }

  editFileMeta(fm: FileMeta) {
    if (fm && isNumberDefined(fm.id)) {
      this.api.getSpecFileData(this.workflowSpec, fm.id, fm.name).subscribe(response => {
        const file = newFileFromResponse(fm, response);
        this._openFileDialog(fm, file);
      });
    } else {
      this._openFileDialog();
    }
  }

  confirmDelete(fm: FileMeta) {
    const dialogRef = this.dialog.open(DeleteFileDialogComponent, {
      data: {
        confirm: false,
        fileMeta: fm,
      },
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
      // Fixme: This buisness rule does not belong here.
      this.fileMetas.forEach(fm => {
        fm.primary = (fmPrimary.id === fm.id);
        this.api.updateSpecFileMeta(this.workflowSpec, fm).subscribe(() => {
          numUpdated++;
          // Reload all fileMetas when all have been updated.
          if (numUpdated === this.fileMetas.length) {
            this._loadFileMetas();
          }
        });
      });
    }
  }

  downloadFile(fm: FileMeta) {
    this.api.getFileData(fm.id).subscribe(response => {
      const blob = new Blob([response.body], {type: fm.content_type});
      fileSaver.saveAs(blob, fm.name);
    });
  }

  private _openFileDialog(fm?: FileMeta, file?: File) {
    const dialogData: OpenFileDialogData = {
      fileMetaId: fm ? fm.id : undefined,
      file,
      mode: 'local',
      fileTypes: [FileType.DOC, FileType.DOCX, FileType.XLSX],
    };
    const dialogRef = this.dialog.open(OpenFileDialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((data: OpenFileDialogData) => {
      if (data && data.file) {
        const newFileMeta: FileMeta = {
          id: data.fileMetaId,
          content_type: data.file.type,
          name: data.file.name,
          type: getFileType(data.file),
          workflow_spec_id: this.workflowSpec.id,
        };

        if (isNumberDefined(data.fileMetaId)) {
          // Update existing file
          this.api.updateSpecFileData(this.workflowSpec, newFileMeta, data.file).subscribe(() => {
            this._loadFileMetas();
          });
        } else {
          this.api.addSpecFile(this.workflowSpec, newFileMeta, data.file).subscribe(dbFm => {
            this._loadFileMetas();
          });
        }
      }
    });
  }

  private _deleteFile(fileMeta: FileMeta) {
    this.api.deleteSpecFileMeta(this.workflowSpec, fileMeta.id, fileMeta.name).subscribe(() => {
      this._loadFileMetas();
      this.snackBar.open(`Deleted file ${fileMeta.name}.`, 'Ok', {duration: 3000});
    });
  }

  private _loadFileMetas() {
    this.api.getSpecFileMetas(this.workflowSpec.id).subscribe(fms => {
      this.fileMetas = fms.sort((a, b) => (a.name > b.name) ? 1 : -1);
    });
  }
}
