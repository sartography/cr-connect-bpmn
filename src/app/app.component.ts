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
      if (this.diagramFile && this.diagramFile.type === 'text/xml') {
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

        // Open new filename/workflow spec dialog
        const dialogRef = this.dialog.open(NewFileDialogComponent, {
          height: '400px',
          width: '400px',
          data: {
            fileName: '',
            workflowSpecId: '',
          },
        });

        dialogRef.afterClosed().subscribe((data: NewFileDialogData) => {
          console.log('dialog afterClosed result', data);

          if (data.fileName && data.workflowSpecId) {
            this.xml = this.draftXml;

            // New fileMeta
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

            // New workflow spec
            this.api.addWorkflowSpecification(newSpec).subscribe(spec => {
              console.log('spec', spec);
              this.api.addFileMeta(this.diagramFileMeta).subscribe(fileMeta => {
                this.loadFilesFromDb();
                this.snackBar.open('Saved changes to new workflow spec and file.', 'Ok', {duration: 5000});
              });
            });
          }
        });

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
}
