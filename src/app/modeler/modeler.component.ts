import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {
  ApiErrorsComponent,
  ApiService,
  FileMeta,
  FileType,
  getDiagramTypeFromXml,
  isNumberDefined,
  newFileFromResponse,
  WorkflowSpec
} from 'sartography-workflow-lib';
import { FileMetaDialogComponent } from '../_dialogs/file-meta-dialog/file-meta-dialog.component';
import { NewFileDialogComponent } from '../_dialogs/new-file-dialog/new-file-dialog.component';
import { ConfirmDialogComponent } from '../_dialogs/confirm-dialog/confirm-dialog.component';
import { BpmnWarning } from '../_interfaces/bpmn-warning';
import { FileMetaDialogData, NewFileDialogData } from '../_interfaces/dialog-data';
import { ImportEvent } from '../_interfaces/import-event';
import { DiagramComponent } from '../diagram/diagram.component';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.scss']
})
export class ModelerComponent implements AfterViewInit {

  constructor(
    private api: ApiService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: SettingsService
  ) {
    this.route.queryParams.subscribe(q => {
      this._handleAction(q);
    });

    this.route.paramMap.subscribe(paramMap => {
      this.workflowSpecId = paramMap.get('workflowSpecId');
      this.fileMetaId = parseInt(paramMap.get('fileMetaId'), 10);
      this.loadFilesFromDb();
    });
  }
  title = 'bpmn-js-angular';
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  importError?: Error;
  importWarnings?: BpmnWarning[];
  expandToolbar = false;
  openMethod: string;
  diagramFile: File;
  workflowSpec: WorkflowSpec;
  bpmnFiles: FileMeta[] = [];
  diagramFileMeta: FileMeta;
  fileName: string;
  fileTypes = FileType;
  private xml = '';
  private draftXml = '';
  private svg = '';
  @ViewChild(DiagramComponent) private diagramComponent: DiagramComponent;
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;
  private diagramType: FileType;
  validationState: boolean;
  validationData: Object = {};
  private workflowSpecId: string;
  private fileMetaId: number;
  private isNew = false;
  private requestFileClick = false;

  static isXmlFile(file: File) {
    return file.type.toLowerCase() === 'text/xml' ||
      file.type.toLowerCase() === 'application/xml' ||
      file.name.slice(-5).toLowerCase() === '.bpmn' ||
      file.name.slice(-4).toLowerCase() === '.dmn' ||
      file.name.slice(-4).toLowerCase() === '.xml';
  }

  ngAfterViewInit(): void {
    this.diagramComponent.registerOnChange((newXmlValue: string, newSvgValue: string) => {
      console.log('ModelerComponent > DiagramComponent > onChange');
      if (this.draftXml !== newXmlValue + ' ') {
        // When we initialize a new dmn, the component registers a change even if nothing
        // changes. So . . . we check to make sure it *really* changed before updating the draftXml.
        this.draftXml = newXmlValue;
      }
      this.svg = newSvgValue;
    });

    if (this.requestFileClick) {
      this.fileInput.nativeElement.click();
      this.requestFileClick = false;
    }
  }

  handleImported(event: ImportEvent) {
    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      this.snackBar.open(`Rendered diagram with ${warnings.length} warnings`, 'Ok', { duration: 5000 });
    }

    if (type === 'error') {
      this.bottomSheet.open(ApiErrorsComponent, { data: { apiErrors: [error] } });
    }

    this.importError = error;
    this.importWarnings = warnings;

    // if this is a new file then we force a change to the file
    if (this.isNew) {
      this.draftXml = this.xml + ' ';
      this.isNew = false;
    } else {
      this.draftXml = this.xml;
    }
  }

  onSubmitFileToOpen() {
    this.expandToolbar = false;


    if (this.diagramFile && ModelerComponent.isXmlFile(this.diagramFile)) {
      this.readFile(this.diagramFile);
    } else {
      this.handleImported({
        type: 'error',
        error: new Error('Wrong file type. Please choose a BPMN XML file.')
      });
    }

    this.openMethod = undefined;
  }

  getFileName() {
    //    return this.diagramFile ? this.diagramFile.name : this.fileName || 'No file selected';
    return this.diagramFileMeta ? this.diagramFileMeta.name : this.fileName || 'No file selected';
  }

  checkSaved() {
    if (this.hasChanged()) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: '300px',
        data: {
          title: 'Unsaved Changes!',
          message: 'Are you sure you want to abandon changes?',
        }
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.router.navigate(['/home', this.workflowSpec.name]);
        }
      });
    } else {
      this.router.navigate(['/home', this.workflowSpec.name]);
    }
  }

  onFileSelected($event: Event) {
    this.diagramFile = ($event.target as HTMLFormElement).files[0];
    this.onSubmitFileToOpen();
    this.isNew = true;
  }

  // Arrow function here preserves this context
  onLoad = (event: ProgressEvent) => {
    this.xml = (event.target as FileReader).result.toString();
    const diagramType = getDiagramTypeFromXml(this.xml);
    this.diagramComponent.openDiagram(this.xml, diagramType);
  }

  readFile(file: File) {
    // FileReader must be instantiated this way so unit test can spy on it.
    const fileReader = new (window as any).FileReader();
    fileReader.onload = this.onLoad;
    fileReader.readAsText(file);
  }

  saveChanges() {
    if (this.hasChanged()) {
      if (this.diagramFileMeta && this.diagramFileMeta.workflow_spec_id) {
        // Save changes to just the file
        this.saveFileChanges();
      } else {
        // Open the File Meta Dialog
        this.editFileMeta();
      }
    }
  }

  partially_validate(until_task: string) {
    this.saveChanges();
    const study_id = this.settingsService.getStudyIdForValidation();
    this.validationState = 'unknown';
    this.validationData = { 'testing_only': {a: 1, b: 'b', c: false, e: [], d: undefined}, 'real_fields': undefined };

    this.api.validateWorkflowSpecification(this.diagramFileMeta.workflow_spec_id, until_task, study_id).subscribe(apiErrors => {
      if (apiErrors && apiErrors.length === 1) {
        if (apiErrors[0].code === 'validation_break') {
          this.validationData = apiErrors[0];
           this.validationState = 'passing';
        } else {
          this.validationData = apiErrors[0];
          this.validationState = 'failing';
        }
      }
      if (apiErrors.length > 0 && this.validationState !== 'passing') {
        this.bottomSheet.open(ApiErrorsComponent, { data: { apiErrors: apiErrors } });
      }
    });
  }

  validate() {
    this.saveChanges();
    const studyId = this.settingsService.getStudyIdForValidation();
    this.api.validateWorkflowSpecification(this.diagramFileMeta.workflow_spec_id, '', studyId).subscribe(apiErrors => {
      if (apiErrors && apiErrors.length > 0) {
        this.bottomSheet.open(ApiErrorsComponent, { data: { apiErrors: apiErrors } });
      } else {
        this.snackBar.open('Workflow specification is valid!', 'Ok', { duration: 5000 });
      }
    });
  }

  hasChanged(): boolean {
    return (this.xml !== this.draftXml) || this.isNew;
  }

  loadDbFile(bf: FileMeta, f: File) {
    this.diagramFile = f;
    this.diagramFileMeta = bf;
    this.onSubmitFileToOpen();
  }

  newDiagram(diagramType?: FileType) {
    this.xml = '';
    this.draftXml = '';
    this.svg = '';
    this.fileName = '';
    this.diagramFileMeta = undefined;
    this.diagramFile = undefined;
    this.diagramType = diagramType;
    this.diagramComponent.openDiagram(undefined, diagramType);
  }

  openFileDialog() {
    // NB - Aaron said that doing this may be problematic.
    // When we are handling the action in the constructor, the component hasn't been
    // Rendered yet. I needed to call fileInput.click() after the component has rendered.

    // In order to make this work, I check for the  requestFileClick variable in ngAfterViewInit
    // and then click it. I couldn't see any other way to make this do what I wanted to do
    // it *appears* to work fine.
    this.requestFileClick = true;
  }

  newFileDialog() {
    const dialogRef = this.dialog.open(NewFileDialogComponent, {});

    dialogRef.afterClosed().subscribe((data: NewFileDialogData) => {
      if (data && data.fileType) {
        this.diagramType = data.fileType;
        this.newDiagram(data.fileType);
      }
    });
  }

  editFileMeta() {
    const dialogRef = this.dialog.open(FileMetaDialogComponent, {
      data: {
        fileName: this.diagramFile ? this.diagramFile.name : this.fileName || '',
        fileType: this.diagramType || getDiagramTypeFromXml(this.xml),
        file: this.diagramFile || undefined,
      },
    });

    dialogRef.afterClosed().subscribe((data: FileMetaDialogData) => {
      if (data && data.fileName) {
        this._upsertFileMeta(data);
      }
    });
  }

  getFileMetaDisplayString(fileMeta: FileMeta) {
    if (fileMeta) {
      return fileMeta.name;
    } else {
      return 'Loading...';
    }
  }

  getFileMetaTooltipText(fileMeta: FileMeta) {
    const spec = this.workflowSpec;

    if (spec) {
      const lastUpdatedDate = new Date(fileMeta.last_modified);
      const lastUpdated = new DatePipe('en-us').transform(lastUpdatedDate, 'medium');
      return `
          File name: ${fileMeta.name}
          Last updated: ${lastUpdated}
          Version: ${fileMeta.latest_version}
      `;
    } else {
      return 'Loading...';
    }
  }

  private loadFilesFromDb() {
    this.api.getWorkflowSpecification(this.workflowSpecId).subscribe(wfs => {
      this.workflowSpec = wfs;
      this.api.getFileMetas({ workflow_spec_id: wfs.id }).subscribe(files => {
        this.bpmnFiles = [];
        files.forEach(f => {
          if ((f.type === FileType.BPMN) || (f.type === FileType.DMN)) {
            f.content_type = 'text/xml';
            this.bpmnFiles.push(f);

            if (f.id === this.fileMetaId) {
              this.diagramFileMeta = f;
              this.api.getFileData(f.id).subscribe(response => {
                this.diagramFile = newFileFromResponse(f, response);
                this.onSubmitFileToOpen();
              });
            }
          }
        });
      });
    });
  }

  private _upsertFileMeta(data: FileMetaDialogData) {
    if (data.fileName) {
      this.xml = this.draftXml;
      const fileMetaId = this.diagramFileMeta ? this.diagramFileMeta.id : undefined;
      const fileType = this.diagramFileMeta ? this.diagramFileMeta.type : FileType.BPMN;
      this.diagramFileMeta = {
        id: fileMetaId,
        content_type: 'text/xml',
        name: data.fileName,
        type: fileType,
        workflow_spec_id: this.workflowSpec.id,
      };
      this.diagramFile = new File([this.xml], data.fileName, { type: 'text/xml' });


      if (this.workflowSpec && isNumberDefined(fileMetaId)) {
        // Update existing file meta
        this.api.updateFileData(this.diagramFileMeta, this.diagramFile).subscribe(() => {
          this.api.updateFileMeta(this.diagramFileMeta).subscribe(() => {
            this.loadFilesFromDb();
            this.snackBar.open(`Saved changes to file ${this.diagramFileMeta.name}.`, 'Ok', { duration: 5000 });
          });
        });
      } else {
        // Add new file meta
        this.api.addFile({ workflow_spec_id: this.workflowSpec.id }, this.diagramFileMeta, this.diagramFile).subscribe(fileMeta => {
          this.router.navigate(['/modeler', this.workflowSpec.id, fileMeta.id]);
          this.snackBar.open(`Saved new file ${fileMeta.name} to workflow spec ${this.workflowSpec.name}.`, 'Ok', { duration: 5000 });
        }, () => {
          // if this fails, we make sure that the file is treated as still new,
          // and we make the user re-enter the file details as they weren't actually saved.
          this.isNew = true;
          this.diagramFileMeta = undefined;
        });
      }
    }
  }

  private saveFileChanges() {
    this.xml = this.draftXml;
    this.diagramFile = new File([this.xml], this.diagramFileMeta.name, { type: 'text/xml' });

    this.api.updateFileData(this.diagramFileMeta, this.diagramFile).subscribe(newFileMeta => {
      this.diagramFileMeta = newFileMeta;
      this.snackBar.open(`Saved changes to file metadata ${this.diagramFileMeta.name}.`, 'Ok', { duration: 5000 });
    });
  }

  private _handleAction(q: Params) {
    if (q && q.action) {
      if (q.action === 'openFile') {
        this.openFileDialog();
      } else if (q.action === 'newFile') {
        this.newFileDialog();
      }
    }
  }

}
