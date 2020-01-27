import {HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, EventEmitter, NgZone, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnModeler from 'dmn-js/lib/Modeler';
import * as fileSaver from 'file-saver';
import {ApiService, FileType} from 'sartography-workflow-lib';
import {DMN_DIAGRAM_EMPTY} from '../../testing/mocks/diagram.mocks';
import {BpmnWarning} from '../_interfaces/bpmn-warning';
import {ImportEvent} from '../_interfaces/import-event';
import {getDiagramTypeFromXml} from '../_util/diagram-type';
import {bpmnModelerConfig} from './bpmn-modeler-config';
import {dmnModelerConfig} from './dmn-modeler-config';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram.component.html',
  styleUrls: ['diagram.component.scss'],
})
export class DiagramComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
  @ViewChild('propertiesRef', {static: true}) propertiesRef: ElementRef;
  @Output() private importDone: EventEmitter<ImportEvent> = new EventEmitter();
  private diagramType: FileType = FileType.BPMN;
  private modeler: BpmnModeler | DmnModeler;
  private xml = '';
  private disabled = false;

  constructor(
    private zone: NgZone,
    private api: ApiService,
  ) {
  }

  get value(): string {
    return this.xml;
  }

  ngAfterViewInit() {
    this.initializeModeler(this.diagramType);
    this.openDiagram(this.xml);
  }

  onChange(value: any) {
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
    this.onChange(this.xml);
  }

  // Allows Angular to register a function to call when the model changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (newXmlValue: string) => void): void {
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
      if (xml) {
        this.modeler.importXML(xml, (e, w) => this.onImport(e, w));
      } else {
        if (this.modeler.createDiagram) {
          this.modeler.createDiagram((e, w) => this.onImport(e, w));
        } else {
          const r = 'REPLACE_ME';
          const newXml = DMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/gi, () => uuidv4().slice(0, 7));
          this.modeler.importXML(newXml, (e, w) => this.onImport(e, w));
        }
      }
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
    this.modeler.saveXML({format: true}, (err, xml) => {
      this.xml = xml;
      this.writeValue(xml);
    });
  }

  saveXML() {
    this.saveDiagram();
    this.modeler.saveXML({format: true}, (err, xml) => {
      const blob = new Blob([xml], {type: 'text/xml'});
      fileSaver.saveAs(blob, `BPMN Diagram - ${new Date().toISOString()}.xml`);
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

    this.modeler.on('commandStack.changed', () => this.saveDiagram());

    this.modeler.on('views.changed', event => this.saveDiagram());

    this.modeler.on('import.done', ({error}) => {
      if (!error) {
        this.modeler.getActiveViewer().get('canvas').zoom('fit-viewport');
      }
    });
  }

  private clearElements() {
    const els: HTMLElement[] = [this.containerRef.nativeElement, this.propertiesRef.nativeElement];
    els.forEach(e => {
      e.innerHTML = '';
    });
  }
}
