import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {
  ApiService,
  FileMeta,
  FileType,
  getDiagramTypeFromXml,
  isNumberDefined,
  WorkflowSpec
} from 'sartography-workflow-lib';
import {FileMetaDialogComponent} from '../_dialogs/file-meta-dialog/file-meta-dialog.component';
import {NewFileDialogComponent} from '../_dialogs/new-file-dialog/new-file-dialog.component';
import {OpenFileDialogComponent} from '../_dialogs/open-file-dialog/open-file-dialog.component';
import {BpmnWarning} from '../_interfaces/bpmn-warning';
import {FileMetaDialogData, NewFileDialogData, OpenFileDialogData} from '../_interfaces/dialog-data';
import {ImportEvent} from '../_interfaces/import-event';
import {DiagramComponent} from '../diagram/diagram.component';

@Component({
  selector: 'app-modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.scss']
})
export class ModelerComponent implements AfterViewInit {
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
  @ViewChild(DiagramComponent) private diagramComponent: DiagramComponent;
  private diagramType: FileType;
  private workflowSpecId: string;
  private fileMetaId: number;

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
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

  ngAfterViewInit(): void {
    this.diagramComponent.registerOnChange((newXmlValue: string) => {
      this.draftXml = newXmlValue;
    });
  }

  handleImported(event: ImportEvent) {
    const {
      type,
      error,
      warnings
    } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (${warnings.length} warnings)`);
    }

    if (type === 'error') {
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
    this.importWarnings = warnings;
    this.draftXml = this.xml;
  }

  onSubmitFileToOpen() {
    this.expandToolbar = false;

    if (this.openMethod === 'url') {
      this.diagramComponent.loadUrl(this.diagramUrl);
    } else {
      if (this.diagramFile && this.isXmlFile(this.diagramFile)) {
        this.readFile(this.diagramFile);
      } else {
        this.handleImported({
          type: 'error',
          error: new Error('Wrong file type. Please choose a BPMN XML file.')
        });
      }
    }

    this.openMethod = undefined;
  }

  getFileName() {
    return this.diagramFile ? this.diagramFile.name : this.fileName || 'No file selected';
  }

  onFileSelected($event: Event) {
    this.diagramFile = ($event.target as HTMLFormElement).files[0];
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

  hasChanged(): boolean {
    return this.xml !== this.draftXml;
  }

  loadDbFile(bf: FileMeta) {
    this.diagramFile = bf.file;
    this.diagramFileMeta = bf;
    this.onSubmitFileToOpen();
  }

  newDiagram(diagramType?: FileType) {
    this.xml = '';
    this.draftXml = '';
    this.fileName = '';
    this.diagramFileMeta = undefined;
    this.diagramFile = undefined;
    this.diagramType = diagramType;
    this.diagramComponent.openDiagram(undefined, diagramType);
  }

  openFileDialog() {
    const dialogRef = this.dialog.open(OpenFileDialogComponent, {});

    dialogRef.afterClosed().subscribe((data: OpenFileDialogData) => {
      if (data && data.file) {
        this.diagramFile = data.file;
        this.onSubmitFileToOpen();
      }
    });
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
      const lastUpdated = new DatePipe('en-us').transform(fileMeta.last_updated);
      return `${fileMeta.name} - v${fileMeta.version} (${lastUpdated})`;
    } else {
      return 'Loading...';
    }
  }

  getFileMetaTooltipText(fileMeta: FileMeta) {
    const spec = this.workflowSpec;

    if (spec) {
      const lastUpdated = new DatePipe('en-us').transform(fileMeta.last_updated);
      return `
          Workflow spec ID: ${spec.id}
          Workflow name: ${spec.name}
          Display name: ${spec.display_name}
          Description: ${spec.description}
          File name: ${fileMeta.name}
          Last updated: ${lastUpdated}
          Version: ${fileMeta.version}
      `;
    } else {
      return 'Loading...';
    }
  }

  private loadFilesFromDb() {
    this.api.getWorkflowSpecification(this.workflowSpecId).subscribe(wfs => {
      this.workflowSpec = wfs;
      this.api.getFileMetas({workflow_spec_id: wfs.id}).subscribe(files => {
        this.bpmnFiles = [];
        files.forEach(f => {
          this.api.getFileData(f.id).subscribe(d => {
            if ((f.type === FileType.BPMN) || (f.type === FileType.DMN)) {
              f.content_type = 'text/xml';
              f.file = new File([d], f.name, {type: f.content_type});
              this.bpmnFiles.push(f);

              if (f.id === this.fileMetaId) {
                this.diagramFileMeta = f;
                this.diagramFile = f.file;
                this.onSubmitFileToOpen();
              }
            }
          });
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
        file: new File([this.xml], data.fileName, {type: 'text/xml'}),
        workflow_spec_id: this.workflowSpec.id,
      };

      if (this.workflowSpec && isNumberDefined(fileMetaId)) {
        // Update existing file meta
        this.api.updateFileData(this.diagramFileMeta).subscribe(() => {
          this.api.updateFileMeta(this.diagramFileMeta).subscribe(() => {
            this.loadFilesFromDb();
            this.snackBar.open(`Saved changes to file ${this.diagramFileMeta.name}.`, 'Ok', {duration: 5000});
          });
        });
      } else {
        // Add new file meta
        this.api.addFileMeta({workflow_spec_id: this.workflowSpec.id}, this.diagramFileMeta).subscribe(fileMeta => {
          this.router.navigate(['/modeler', this.workflowSpec.id, fileMeta.id]);
          this.snackBar.open(`Saved new file ${fileMeta.name} to workflow spec ${this.workflowSpec.name}.`, 'Ok', {duration: 5000});
        });
      }
    }
  }

  private isXmlFile(file: File) {
    return file.type.toLowerCase() === 'text/xml' ||
      file.type.toLowerCase() === 'application/xml' ||
      file.name.slice(-5).toLowerCase() === '.bpmn' ||
      file.name.slice(-4).toLowerCase() === '.dmn' ||
      file.name.slice(-4).toLowerCase() === '.xml';
  }

  private saveFileChanges() {
    this.xml = this.draftXml;
    this.diagramFileMeta.file = new File([this.xml], this.diagramFileMeta.name, {type: 'text/xml'});

    this.api.updateFileData(this.diagramFileMeta).subscribe(newFileMeta => {
      this.diagramFileMeta = newFileMeta;
      this.snackBar.open(`Saved changes to file metadata ${this.diagramFileMeta.name}.`, 'Ok', {duration: 5000});
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
