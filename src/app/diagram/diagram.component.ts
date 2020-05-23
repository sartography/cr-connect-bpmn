import {formatDate} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnModeler from 'dmn-js/lib/Modeler';
import * as fileSaver from 'file-saver';
import {
  ApiService,
  BPMN_DIAGRAM_DEFAULT,
  DMN_DIAGRAM_DEFAULT,
  FileType,
  getDiagramTypeFromXml
} from 'sartography-workflow-lib';
import {v4 as uuidv4} from 'uuid';
import {BpmnWarning} from '../_interfaces/bpmn-warning';
import {ImportEvent} from '../_interfaces/import-event';
import {bpmnModelerConfig} from './bpmn-modeler-config';
import {dmnModelerConfig} from './dmn-modeler-config';

@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram.component.html',
  styleUrls: ['diagram.component.scss'],
})
export class DiagramComponent implements ControlValueAccessor, AfterViewInit {
  @Input() fileName: string;
  @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
  @ViewChild('propertiesRef', {static: true}) propertiesRef: ElementRef;
  @Output() private importDone: EventEmitter<ImportEvent> = new EventEmitter();
  private diagramType: FileType;
  private modeler: BpmnModeler | DmnModeler;
  private xml = '';
  private svg;
  private disabled = false;

  // Hack so we can spy on this function
  private _formatDate = formatDate;

  constructor(
    private zone: NgZone,
    private api: ApiService,
  ) {
  }

  get value(): string {
    return this.xml;
  }

  get svgValue(): string {
    return this.svg;
  }

  ngAfterViewInit() {
    this.initializeModeler(this.diagramType);
    this.openDiagram(this.xml);
  }

  onChange(newValue: string, svgValue: string) {
    console.log('DiagramComponent default onChange');
  }

  onTouched() {
  }

  initializeModeler(diagramType: FileType) {
    this.clearElements();

    if (diagramType === FileType.DMN) {
      this.initializeDMNModeler();
    } else {
      this.initializeBPMNModeler();
    }
  }

  // Allows Angular to update the model.
  // Update the model and changes needed for the view here.
  writeValue(value: any): void {
    if (value !== this.xml) {
      this.openDiagram(value);
    }
    this.xml = value;
    this.onChange(this.xml, this.svg);
  }

  // Allows Angular to register a function to call when the model changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (newXmlValue: string, newSvgValue: string) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  openDiagram(xml?: string, diagramType?: FileType) {
    this.diagramType = diagramType || getDiagramTypeFromXml(xml);
    this.xml = xml;
    this.initializeModeler(diagramType);

    return this.zone.run(() => {
      if (!xml) {
        const defaultXml = diagramType === FileType.DMN ? DMN_DIAGRAM_DEFAULT : BPMN_DIAGRAM_DEFAULT;
        xml = defaultXml.replace(/REPLACE_ME/gi, () => this.getRandomString(7));
      }

      this.modeler.importXML(xml, (e, w) => this.onImport(e, w));
    });
  }

  saveSVG() {
    this.saveDiagram();
    this.modeler.saveSVG((err, svg) => {
      const blob = new Blob([svg], {type: 'image/svg+xml'});
      fileSaver.saveAs(blob, `${this.diagramType.toString().toUpperCase()} Diagram - ${new Date().toISOString()}.svg`);
    });
  }

  saveDiagram() {
    if (this.modeler && this.modeler.saveSVG) {
      this.modeler.saveSVG((svgErr, svg) => {
        this.svg = svg;
        this.modeler.saveXML({format: true}, (xmlErr, xml) => {
          this.xml = xml;
          this.writeValue(xml);
        });
      });
    } else {
      this.modeler.saveXML({format: true}, (xmlErr, xml) => {
        this.xml = xml;
        this.writeValue(xml);
      });
    }
  }

  saveXML() {
    this.saveDiagram();
    this.modeler.saveXML({format: true}, (err, xml) => {
      const blob = new Blob([xml], {type: 'text/xml'});
      fileSaver.saveAs(blob, this.insertDateIntoFileName());
    });
  }

  onImport(err?: HttpErrorResponse, warnings?: BpmnWarning[]) {
    if (err) {
      this._handleErrors(err);
    } else {
      this._handleWarnings(warnings);
    }
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string) {
    this.api.getStringFromUrl(url).subscribe(xml => {
      const diagramType = getDiagramTypeFromXml(xml);
      this.openDiagram(xml, diagramType);
    }, error => this._handleErrors(error));
  }

  private _handleWarnings(warnings: BpmnWarning[]) {
    this.importDone.emit({
      type: 'success',
      warnings: warnings
    });
  }

  private _handleErrors(err) {
    this.importDone.emit({
      type: 'error',
      error: err
    });
  }

  private initializeBPMNModeler() {
    this.modeler = new BpmnModeler({
      container: this.containerRef.nativeElement,
      propertiesPanel: {
        parent: this.propertiesRef.nativeElement,
      },
      additionalModules: bpmnModelerConfig.additionalModules,
      moddleExtensions: bpmnModelerConfig.moddleExtensions,
    });

    this.modeler.get('eventBus').on('commandStack.changed', () => this.saveDiagram());

    this.modeler.on('import.done', ({error}) => {
      if (!error) {
        this.modeler.get('canvas').zoom('fit-viewport');
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    });
  }

  private initializeDMNModeler() {
    this.modeler = new DmnModeler({
      container: this.containerRef.nativeElement,
      drd: {
        propertiesPanel: {
          parent: this.propertiesRef.nativeElement,
        },
        additionalModules: dmnModelerConfig.additionalModules,
      },
      moddleExtensions: dmnModelerConfig.moddleExtensions,
    });

    this.modeler.on('commandStack.changed', () => {
      this.saveDiagram();
    });

    this.modeler.on('views.changed', () => {
      this.saveDiagram();

      const viewer = this.modeler.getActiveViewer();
      if (viewer) {
        viewer.get('eventBus').on('commandStack.changed', () => this.saveDiagram());
      }
    });

    this.modeler.on('import.done', ({error}) => {
      if (!error) {
        const activeView = this.modeler.getActiveView();

        if (activeView.type === 'drd') {
          this.modeler.getActiveViewer().get('canvas').zoom('fit-viewport');
        }

        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    });
  }

  private clearElements() {
    const els: HTMLElement[] = [this.containerRef.nativeElement, this.propertiesRef.nativeElement];
    els.forEach(e => {
      e.innerHTML = '';
    });
  }

  private getRandomString(len: number): string {
    return uuidv4().slice(0, len);
  }

  private insertDateIntoFileName(): string {
    const arr = this.fileName.split('.');
    const dateString = this._formatDate(new Date(), 'yyyy-MM-dd_HH:mm', 'en-us');

    if (arr.length > 1) {
      // Insert date between file name and extension
      const ext = arr[arr.length - 1];
      const name = arr.slice(0, -1);
      return `${name.join('.')}_${dateString}.${ext}`;
    } else {
      // No extension in file name yet. Add it, based on the diagram type.
      return `${this.fileName}_${dateString}.${this.diagramType}`;
    }
  }
}
