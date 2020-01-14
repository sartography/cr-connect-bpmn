import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';
import {BpmnWarning} from './_interfaces/bpmn-warning';
import {ImportEvent} from './_interfaces/import-event';
import {NewFileDialogData} from './_interfaces/new-file-dialog-data';
import {ApiService} from './_services/api.service';
import {DiagramComponent} from './diagram/diagram.component';
import {NewFileDialogComponent} from './new-file-dialog/new-file-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'bpmn-js-angular';
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  importError?: Error;
  importWarnings?: BpmnWarning[];
  expandToolbar = false;
  openMethod: string;
  diagramFile: File;
  workflowSpecs: WorkflowSpec[] = [];
  workflowSpec: WorkflowSpec;
  bpmnFiles: FileMeta[] = [];
  diagramFileMeta: FileMeta;
  fileName: string;
  private xml = '';
  private draftXml = '';
  @ViewChild(DiagramComponent, {static: false}) private diagramComponent: DiagramComponent;

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.loadFilesFromDb();
  }

  ngAfterViewInit(): void {
    this.diagramComponent.registerOnChange((newXmlValue: string) => {
      this.draftXml = newXmlValue;
    });

    this.diagramComponent.registerOnTouched(() => {
      console.log('diagramComponent onTouch');
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
    return this.diagramFile ? this.diagramFile.name : 'No file selected';
  }

  onFileSelected($event: Event) {
    this.diagramFile = ($event.target as HTMLFormElement).files[0];
  }

  // Arrow function here preserves this context
  onLoad = (event: ProgressEvent) => {
    this.xml = (event.target as FileReader).result.toString();
    this.diagramComponent.openDiagram(this.xml);
  }

  readFile(file: File) {
    // FileReader must be instantiated this way so unit test can spy on it.
    const fileReader = new (window as any).FileReader();
    fileReader.onload = this.onLoad;
    fileReader.readAsText(file);
  }

  saveChanges() {
    if (this.hasChanged()) {

      console.log('saveChanges this.diagramFileMeta', this.diagramFileMeta);
      if (this.diagramFileMeta && this.diagramFileMeta.workflow_spec_id) {
        this.xml = this.draftXml;
        this.diagramFileMeta.file = new File([this.xml], this.diagramFileMeta.name, {type: 'text/xml'});
        this.api.updateFileMeta(this.diagramFileMeta).subscribe(() => {
          this.snackBar.open('Saved changes.', 'Ok', {duration: 5000});
        });
      } else {
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
    this.workflowSpec = this.workflowSpecs.find(wfs => wfs.id === bf.workflow_spec_id);
    this.onSubmitFileToOpen();
  }

  newDiagram() {
    this.xml = '';
    this.draftXml = '';
    this.fileName = '';
    this.diagramFileMeta = undefined;
    this.diagramFile = undefined;
    this.diagramComponent.createNewDiagram();
  }

  private loadFilesFromDb() {
    this.api.listWorkflowSpecifications().subscribe(wfs => {
      this.workflowSpecs = wfs;
      this.workflowSpecs.forEach(w => {
        this.api.listBpmnFiles(w.id).subscribe(files => {
          this.bpmnFiles = [];
          files.forEach(f => {
            this.api.getFileData(f.id).subscribe(d => {
              f.content_type = (f.type === FileType.SVG) ? 'image/svg+xml' : f.content_type = 'text/xml';
              f.file = new File([d], f.name, {type: f.content_type});
              this.bpmnFiles.push(f);
            });
          });
        });
      });
    });
  }

  editFileMeta() {
    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(NewFileDialogComponent, {
      height: '400px',
      width: '400px',
      data: {
        fileName: this.diagramFileMeta ? this.diagramFileMeta.name : '',
        workflowSpecId: this.diagramFileMeta ? this.diagramFileMeta.workflow_spec_id : '',
        description: this.workflowSpec ? this.workflowSpec.description : '',
        displayName: this.workflowSpec ? this.workflowSpec.display_name : '',
      },
    });

    dialogRef.afterClosed().subscribe((data: NewFileDialogData) => {
      console.log('dialog afterClosed result', data);
      if (data && data.fileName && data.workflowSpecId) {
        this._upsertSpecAndFileMeta(data);
      }
    });
  }

  private _upsertSpecAndFileMeta(data: NewFileDialogData) {
    if (data.fileName && data.workflowSpecId) {
      this.xml = this.draftXml;

      // Save old workflow spec id, if user wants to change it
      const specId = this.workflowSpec ? this.workflowSpec.id : undefined;

      this.workflowSpec = {
        id: data.workflowSpecId,
        display_name: data.displayName,
        description: data.description,
      };

      this.diagramFileMeta = {
        content_type: 'text/xml',
        name: data.fileName,
        type: FileType.BPMN,
        file: new File([this.xml], data.fileName, {type: 'text/xml'}),
        workflow_spec_id: data.workflowSpecId,
      };

      const newSpec: WorkflowSpec = {
        id: data.workflowSpecId,
        display_name: data.displayName,
        description: data.description,
      };

      if (specId) {
        // Update existing workflow spec and file
        this.api.updateWorkflowSpecification(specId, newSpec).subscribe(spec => {
          this.api.updateFileMeta(this.diagramFileMeta).subscribe(fileMeta => {
            this.loadFilesFromDb();
            this.snackBar.open('Saved changes to workflow spec and file.', 'Ok', {duration: 5000});
          });
        });
      } else {
        // Add new workflow spec and file
        this.api.addWorkflowSpecification(newSpec).subscribe(spec => {
          this.api.addFileMeta(newSpec.id, this.diagramFileMeta).subscribe(fileMeta => {
            this.loadFilesFromDb();
            this.snackBar.open('Saved new workflow spec and file.', 'Ok', {duration: 5000});
          });
        });
      }
    }
  }

  getWorkflowSpec(workflow_spec_id: string): WorkflowSpec {
    return this.workflowSpecs.find(wfs => workflow_spec_id === wfs.id);
  }

  getFileMetaDisplayString(fileMeta: FileMeta) {
    const wfsName = this.getWorkflowSpec(fileMeta.workflow_spec_id).display_name;
    const lastUpdated = new DatePipe('en-us').transform(fileMeta.last_updated);
    return `${wfsName} (${fileMeta.name}) - v${fileMeta.version} (${lastUpdated})`;
  }

  getFileMetaTooltipText(fileMeta: FileMeta) {
    const wfs = this.getWorkflowSpec(fileMeta.workflow_spec_id);
    const lastUpdated = new DatePipe('en-us').transform(fileMeta.last_updated);
    return `
        Workflow spec ID: ${wfs.id}
        Display name: ${wfs.display_name}
        Description: ${wfs.description}
        File name: ${fileMeta.name}
        Last updated: ${lastUpdated}
        Version: ${fileMeta.version}
    `;
  }

  private isXmlFile(file: File) {
    return file.type === 'text/xml' ||
      file.type === 'application/xml' ||
      file.name.slice(-5) === '.bpmn' ||
      file.name.slice(-4) === '.xml';
  }
}
