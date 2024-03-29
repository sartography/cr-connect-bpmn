import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as fileSaver from 'file-saver';
import {ApiService, FileMeta, FileParams, FileType, getFileType} from 'sartography-workflow-lib';
import {OpenFileDialogComponent} from '../_dialogs/open-file-dialog/open-file-dialog.component';
import {OpenFileDialogData} from '../_interfaces/dialog-data';

@Component({
  selector: 'app-reference-files',
  templateUrl: './reference-files.component.html',
  styleUrls: ['./reference-files.component.scss']
})
export class ReferenceFilesComponent {
  referenceFiles: FileMeta[];

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this._loadReferenceFiles();
  }

  _loadReferenceFiles() {
    this.apiService.listReferenceFiles().subscribe(f => this.referenceFiles = f);
  }

  openFileDialog(fm: FileMeta) {
    this.apiService.getReferenceFileData(fm.name).subscribe(oldFile => {
      const dialogData: OpenFileDialogData = {
        fileMetaId: fm.id,
        file: new File([oldFile.body], fm.name, {
          type: fm.content_type,
          lastModified: parseInt(oldFile.headers.get('last-modified'), 10)
        }),
        mode: 'local',
        fileTypes: [FileType.XLSX, FileType.XLS],
      };
      const dialogRef = this.dialog.open(OpenFileDialogComponent, {data: dialogData});

      dialogRef.afterClosed().subscribe((data: OpenFileDialogData) => {
        if (data && data.file) {
          this.apiService.updateReferenceFile(fm.name, data.file).subscribe(() => {
          this.snackBar.open(`Updated file ${fm.name}.`, 'Ok', {duration: 3000});
            this._loadReferenceFiles();
          });
        }
      });
    });
  }

  downloadFile(fm: FileMeta) {
    this.apiService.getReferenceFileData(fm.name).subscribe(response => {
      const blob = new Blob([response.body], {type: fm.content_type});
      fileSaver.saveAs(blob, fm.name);
    });
  }

  addNewReferenceFile(fm?: FileMeta, file?: File) {
    const dialogData: OpenFileDialogData = {
      fileMetaId: fm ? fm.id : undefined,
      file,
      mode: 'reference',
      fileTypes: [FileType.DOC, FileType.DOCX, FileType.XLSX, FileType.XLS],
    };
    const dialogRef = this.dialog.open(OpenFileDialogComponent, {data: dialogData});

    dialogRef.afterClosed().subscribe((data: OpenFileDialogData) => {
      if (data && data.file) {
        const newFileMeta: FileMeta = {
          content_type: data.file.type,
          name: data.file.name,
          type: getFileType(data.file),
          is_reference: true,
        };
          this.apiService.addReferenceFile(newFileMeta, data.file).subscribe(refs => {
            this.snackBar.open(`Added new file ${newFileMeta.name}.`, 'Ok', {duration: 3000});
            this._loadReferenceFiles();
          });
      }
    });
  }

  deleteFile(id: number, name: string) {
    this.apiService.deleteRefFileMeta(id).subscribe(f => {
      this.snackBar.open(`Deleted reference file ${name}.`, 'Ok', {duration: 3000});
      this._loadReferenceFiles();
    });
  }
}
