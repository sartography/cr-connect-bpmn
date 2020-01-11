import {Component, ViewChild} from '@angular/core';
import {FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';
import {BPMN_DIAGRAM} from '../testing/mocks/diagram.mocks';
import {BpmnWarning} from './_interfaces/bpmn-warning';
import {ImportEvent} from './_interfaces/import-event';
import {ApiService} from './_services/api.service';
import {DiagramComponent} from './diagram/diagram.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bpmn-js-angular';
  diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
  importError?: Error;
  importWarnings?: BpmnWarning[];
  xmlModel: any;
  expandToolbar = false;
  openMethod: string;
  diagramFile: File;
  workflowSpecs: WorkflowSpec[] = [];
  bpmnFiles: FileMeta[] = [];
  @ViewChild(DiagramComponent, {static: false}) private diagramComponent: DiagramComponent;

  constructor(private api: ApiService) {
    this.xmlModel = BPMN_DIAGRAM;
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

    // Clear the inputs
    this.diagramFile = undefined;
    this.diagramUrl = undefined;
  }

  onSubmit($event: MouseEvent) {
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
    const xml = (event.target as FileReader).result;
    this.diagramComponent.openDiagram(xml.toString());
  }

  readFile(file: File) {
    console.log('readFile', file);

    // FileReader must be instantiated this way so unit test can spy on it.
    const fileReader = new (window as any).FileReader();
    fileReader.onload = this.onLoad;
    fileReader.readAsText(file);
  }
}
