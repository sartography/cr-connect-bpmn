import {DatePipe} from '@angular/common';
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {ApiService, FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';
import {BpmnWarning} from '../_interfaces/bpmn-warning';
import {FileMetaDialogData} from '../_interfaces/file-meta-dialog-data';
import {ImportEvent} from '../_interfaces/import-event';
import {getDiagramTypeFromXml} from '../_util/diagram-type';
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
  fileTypes = FileType;
  private xml = '';
  private draftXml = '';
  @ViewChild(DiagramComponent, {static: false}) private diagramComponent: DiagramComponent;
  private diagramType: FileType;
  private workflowSpecId: string;
  private fileMetaId: number;

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,
  ) {

    this.route.queryParams.subscribe(q => {
      if (q && q.action) {
        if (q.action === 'openFile') {
          this.expandToolbar = true;
          this.openMethod = 'file';
        } else if (q.action === 'newFile') {

        }
      }
    })

    this.route.paramMap.subscribe(paramMap => {
      console.log('paramMap', paramMap);
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
    this.workflowSpec = this.getWorkflowSpec(bf.workflow_spec_id);
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

  editFileMeta() {
    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(FileMetaDialogComponent, {
      height: '400px',
      width: '400px',
      data: {
        fileName: this.diagramFile ? this.diagramFile.name : this.fileName || '',
        fileType: getDiagramTypeFromXml(this.xml),
      },
    });

    dialogRef.afterClosed().subscribe((data: FileMetaDialogData) => {
      if (data && data.fileName) {
        this._upsertFileMeta(data);
      }
    });
  }

  getWorkflowSpec(workflow_spec_id: string): WorkflowSpec {
    return this.workflowSpecs.find(wfs => workflow_spec_id === wfs.id);
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

  private loadFilesFromDb() {
    this.api.getWorkflowSpecList().subscribe(wfs => {
        this.workflowSpecs = wfs;
        this.workflowSpecs.forEach(w => {
          if (w.id === this.workflowSpecId) {
            this.workflowSpec = w;
            this.api.listBpmnFiles(w.id).subscribe(files => {
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
          }
        });
      });
  }

  private _upsertFileMeta(data: FileMetaDialogData) {
    if (data.fileName) {
      this.xml = this.draftXml;

      // Save old workflow spec id, if user wants to change it
      const specId = this.workflowSpec ? this.workflowSpec.id : undefined;
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

      if (specId && fileMetaId) {
        // Update existing file meta
        this.api.updateFileMeta(specId, this.diagramFileMeta).subscribe(fileMeta => {
          this.loadFilesFromDb();
          this.snackBar.open('Saved changes to workflow spec and file.', 'Ok', {duration: 5000});
        });
      } else {
        // Add new file meta
        this.api.addFileMeta(specId, this.diagramFileMeta).subscribe(fileMeta => {
          this.loadFilesFromDb();
          this.snackBar.open('Saved new workflow spec and file.', 'Ok', {duration: 5000});
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
    this.api.updateFileMeta(this.workflowSpec.id, this.diagramFileMeta).subscribe(() => {
      this.snackBar.open('Saved changes to file.', 'Ok', {duration: 5000});
    });
  }
}
