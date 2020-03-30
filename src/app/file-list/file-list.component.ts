import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ApiService,
  FileMeta,
  FileParams,
  FileType,
  getFileType,
  isNumberDefined,
  WorkflowSpec
} from 'sartography-workflow-lib';
import {DeleteFileDialogComponent} from '../_dialogs/delete-file-dialog/delete-file-dialog.component';
import {OpenFileDialogComponent} from '../_dialogs/open-file-dialog/open-file-dialog.component';
import {DeleteFileDialogData, OpenFileDialogData} from '../_interfaces/dialog-data';
import * as fileSaver from 'file-saver';

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
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
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
      this.api.getFileData(fm.id).subscribe(fileData => {
        const file = new File([fileData], fm.name, {type: fm.content_type});
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

  private _openFileDialog(fm?: FileMeta, file?: File) {
    console.log('fm.id', fm && fm.id);
    const dialogData: OpenFileDialogData = {
      fileMetaId: fm ? fm.id : undefined,
      file: file,
      mode: 'local',
      fileTypes: [FileType.DOCX],
    };
    const dialogRef = this.dialog.open(OpenFileDialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((data: OpenFileDialogData) => {
      if (data && data.file) {
        const newFileMeta: FileMeta = {
          id: data.fileMetaId,
          content_type: data.file.type,
          name: data.file.name,
          type: getFileType(data.file),
          file: data.file,
          workflow_spec_id: this.workflowSpec.id,
        };

        if (isNumberDefined(data.fileMetaId)) {
          // Update existing file
          this.api.updateFileData(newFileMeta).subscribe(() => {
            this._loadFileMetas();
          });
        } else {
          // Add new file
          const fileParams: FileParams = {
            workflow_spec_id: this.workflowSpec.id,
          };

          this.api.addFileMeta(fileParams, newFileMeta).subscribe(dbFm => {
            this._loadFileMetas();
          });
        }
      }
    });

  }

  private _deleteFile(fileMeta: FileMeta) {
    this.api.deleteFileMeta(fileMeta.id).subscribe(() => {
      this._loadFileMetas();
      this.snackBar.open(`Deleted file ${fileMeta.name}.`, 'Ok', {duration: 3000});
    });
  }

  private _loadFileMetas() {
    this.api.getFileMetas({workflow_spec_id: this.workflowSpec.id}).subscribe(fms => {
      this.fileMetas = fms.sort((a, b) => (a.name > b.name) ? 1 : -1);
      this._loadFileData();
    });
  }

  private _loadFileData() {
    this.fileMetas.forEach(fm => {
      this.api.getFileData(fm.id).subscribe((fd: File) => fm.file = fd);
    });
  }

  downloadFile(fm: FileMeta) {
    this.api.getFileData(fm.id).subscribe(fileBlob => {
      const blob = new Blob([fileBlob], {type: fm.content_type});
      fileSaver.saveAs(blob, fm.name);
    });
  }
}
