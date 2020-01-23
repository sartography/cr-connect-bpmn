import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService, FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';
import {BpmnWarning} from '../_interfaces/bpmn-warning';
import {FileMetaDialogData} from '../_interfaces/file-meta-dialog-data';
import {ImportEvent} from '../_interfaces/import-event';
import {DiagramComponent} from '../diagram/diagram.component';
import {FileMetaDialogComponent} from '../file-meta-dialog/file-meta-dialog.component';

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

      const props = this.diagramComponent.properties;
      if (props) {
        const entries = props.entries;
        console.log('id', entries.id.oldValues.id);
        console.log('name', entries.name.oldValues.name);
      }

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
    this.workflowSpec = this.getWorkflowSpec(bf.workflow_spec_id);
    this.onSubmitFileToOpen();
  }

  newDiagram() {
    this.xml = '';
    this.draftXml = '';
    this.fileName = '';
    this.workflowSpec = undefined;
    this.diagramFileMeta = undefined;
    this.diagramFile = undefined;
    this.diagramComponent.createNewDiagram();
  }

  private loadFilesFromDb() {
    this.api.getWorkflowSpecList().subscribe(wfs => {
      this.workflowSpecs = wfs;
      this.workflowSpecs.forEach(w => {
        this.api.listBpmnFiles(w.id).subscribe(files => {
          this.bpmnFiles = [];
          files.forEach(f => {
            this.api.getFileData(f.id).subscribe(d => {
              if (f.type === FileType.BPMN) {
                f.content_type = 'text/xml';
                f.file = new File([d], f.name, {type: f.content_type});
                this.bpmnFiles.push(f);
              }
            });
          });
        });
      });
    });
  }

  editFileMeta() {
    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(FileMetaDialogComponent, {
      height: '400px',
      width: '400px',
      data: {
        fileName: this.diagramFileMeta ? this.diagramFileMeta.name : '',
        workflowSpecId: this.diagramFileMeta ? this.diagramFileMeta.workflow_spec_id : '',
        description: this.workflowSpec ? this.workflowSpec.description : '',
        displayName: this.workflowSpec ? this.workflowSpec.display_name : '',
      },
    });

    dialogRef.afterClosed().subscribe((data: FileMetaDialogData) => {
      if (data && data.fileName && data.workflowSpecId) {
        this._upsertSpecAndFileMeta(data);
      }
    });
  }

  private _upsertSpecAndFileMeta(data: FileMetaDialogData) {
    if (data.fileName && data.workflowSpecId) {
      this.xml = this.draftXml;

      // Save old workflow spec id, if user wants to change it
      const specId = this.workflowSpec ? this.workflowSpec.id : undefined;

      this.workflowSpec = {
        id: data.workflowSpecId,
        name: data.name,
        display_name: data.displayName,
        description: data.description,
      };

      const fileMetaId = this.diagramFileMeta ? this.diagramFileMeta.id : undefined;
      this.diagramFileMeta = {
        id: fileMetaId,
        content_type: 'text/xml',
        name: data.fileName,
        type: FileType.BPMN,
        file: new File([this.xml], data.fileName, {type: 'text/xml'}),
        workflow_spec_id: data.workflowSpecId,
      };

      const newSpec: WorkflowSpec = {
        id: data.workflowSpecId,
        name: data.name,
        display_name: data.displayName,
        description: data.description,
      };

      if (specId) {
        // Update existing workflow spec and file
        this.api.updateWorkflowSpecification(specId, newSpec).subscribe(spec => {
          this.api.updateFileMeta(specId, this.diagramFileMeta).subscribe(fileMeta => {
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
    const spec = this.getWorkflowSpec(fileMeta.workflow_spec_id);

    if (spec) {
      const specName = spec.id + ' - ' + spec.name + ' - ' + spec.display_name;
      const lastUpdated = new DatePipe('en-us').transform(fileMeta.last_updated);
      return `${specName} (${fileMeta.name}) - v${fileMeta.version} (${lastUpdated})`;
    } else {
      return 'Loading...';
    }
  }

  getFileMetaTooltipText(fileMeta: FileMeta) {
    const spec = this.getWorkflowSpec(fileMeta.workflow_spec_id);

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

  private isXmlFile(file: File) {
    return file.type === 'text/xml' ||
      file.type === 'application/xml' ||
      file.name.slice(-5) === '.bpmn' ||
      file.name.slice(-4) === '.xml';
  }

  private saveFileChanges() {
    this.xml = this.draftXml;
    this.diagramFileMeta.file = new File([this.xml], this.diagramFileMeta.name, {type: 'text/xml'});
    this.api.updateFileMeta(this.workflowSpec.id, this.diagramFileMeta).subscribe(() => {
      this.snackBar.open('Saved changes to file.', 'Ok', {duration: 5000});
    });
  }
}
