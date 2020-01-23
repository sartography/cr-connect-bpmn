import {HttpErrorResponse} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, EventEmitter, NgZone, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import * as bpmnPropertiesPanelModule from 'bpmn-js-properties-panel';
import * as bpmnPropertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';

import * as dmnPropertiesPanelModule from 'dmn-js-properties-panel';
import drdAdapterModule from 'dmn-js-properties-panel/lib/adapter/drd';
import * as dmnPropertiesProviderModule from 'dmn-js-properties-panel/lib/provider/camunda';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnModeler from 'dmn-js/lib/Modeler';

import * as bpmnModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import * as dmnModdleDescriptor from 'camunda-dmn-moddle/resources/camunda.json';

import minimapModule from 'diagram-js-minimap';

import * as fileSaver from 'file-saver';
import {ApiService} from 'sartography-workflow-lib';
import {BpmnWarning} from '../_interfaces/bpmn-warning';
import {ImportEvent} from '../_interfaces/import-event';

@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram.component.html',
  styleUrls: ['diagram.component.scss'],
})
export class DiagramComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
  @ViewChild('propertiesRef', {static: true}) propertiesRef: ElementRef;
  @Output() private importDone: EventEmitter<ImportEvent> = new EventEmitter();
  private modeler: BpmnModeler|DmnModeler;
  private xml = '';
  private disabled = false;

  constructor(
    private zone: NgZone,
    private api: ApiService,
  ) {
  }

  get value(): string { return this.xml; }

  get properties(): any { return this.modeler.get('propertiesPanel')._current; }

  ngAfterViewInit() {
    this.initializeModeler('bpmn');
    this.openDiagram(this.xml);
  }

  onChange(value: any) {
  }

  onTouched() {
  }

  initializeModeler(diagramType) {
    if (diagramType === 'dmn') {
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

  createNewDiagram() {
    this.openDiagram();
  }

  openDiagram(xml?: string, diagramType?: string) {
    this.xml = xml;
    this.initializeModeler(diagramType);
    return this.zone.run(() => {
      if (xml) {
        this.modeler.importXML(xml, (e, w) => this.onImport(e, w));
      } else {
        this.modeler.createDiagram((e, w) => this.onImport(e, w));
      }
    });
  }

  saveSVG() {
    this.saveDiagram();
    this.modeler.saveSVG((err, svg) => {
      const blob = new Blob([svg], {type: 'image/svg+xml'});
      fileSaver.saveAs(blob, `BPMN Diagram - ${new Date().toISOString()}.svg`);
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
      this.openDiagram(xml);
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
      additionalModules: [
        bpmnPropertiesProviderModule,
        bpmnPropertiesPanelModule,
        minimapModule,
      ],
      moddleExtensions: {
        camunda: bpmnModdleDescriptor['default']
      }
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
      propertiesPanel: {
        parent: this.propertiesRef.nativeElement,
      },
      additionalModules: [
        dmnPropertiesProviderModule,
        dmnPropertiesPanelModule,
        drdAdapterModule,
      ],
      moddleExtensions: {
        camunda: dmnModdleDescriptor['default']
      }
    });
  }
}
