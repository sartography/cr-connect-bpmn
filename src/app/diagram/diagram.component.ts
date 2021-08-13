import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import DmnModeler from 'dmn-js/lib/Modeler';
import * as fileSaver from 'file-saver';
import {
  ApiService,
  BPMN_DIAGRAM_DEFAULT,
  CameltoSnakeCase,
  DMN_DIAGRAM_DEFAULT,
  FileType,
} from 'sartography-workflow-lib';
import { v4 as uuidv4 } from 'uuid';
import { BpmnError, BpmnWarning } from '../_interfaces/bpmn-warning';
import { ImportEvent } from '../_interfaces/import-event';
import { bpmnModelerConfig } from './bpmn-modeler-config';
import { dmnModelerConfig } from './dmn-modeler-config';
import { getDiagramTypeFromXml } from '../_util/diagram-type';
import isEqual from 'lodash.isequal';

@Component({
  selector: 'app-diagram',
  templateUrl: 'diagram.component.html',
  styleUrls: ['diagram.component.scss'],
})
export class DiagramComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
  @ViewChild('propertiesRef', {static: true}) propertiesRef: ElementRef;
  @Input() fileName: string;
  @Input() validation_data: { [key: string]: any } = {};
  @Input() validation_state: string;
  @Output() validationStart: EventEmitter<string> = new EventEmitter();
  @Output() private importDone: EventEmitter<ImportEvent> = new EventEmitter();
  public eventBus;
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.validation_data) {
      this.validation_data = changes.validation_data.currentValue;
      if (this.modeler) {
        if (this.validation_data.task_data) {
          this.modeler.get('eventBus').fire('editor.objects.response', {objects: this.validation_data.task_data});
        }
      }
    }
    if (changes.validation_state) {
      this.validation_state = changes.validation_state.currentValue;
      if (this.modeler) {
        const resp = {
          state: this.validation_state, line_number: undefined,
        };
        if (this.validation_data.line_number) {
          resp.line_number = this.validation_data.line_number;
        }
        this.modeler.get('eventBus').fire('editor.validation.response', resp);
      }
    }
  }

  onTouched() {
  }

  initializeModeler(diagramType: FileType): DmnModeler | BpmnModeler {
    this.clearElements();

    if (diagramType === FileType.DMN) {
      return this.initializeDMNModeler() as DmnModeler;
    } else {
      return this.initializeBPMNModeler() as BpmnModeler;
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
    const modeler = this.initializeModeler(diagramType);

    return this.zone.run(() => {
      const isDMN = diagramType === FileType.DMN;

      if (!xml) {
        const defaultXml = isDMN ? DMN_DIAGRAM_DEFAULT : BPMN_DIAGRAM_DEFAULT;
        const randomString = this.getRandomString(7);
        xml = defaultXml.replace(/REPLACE_ME/gi, () => randomString);
      }

      // Add an arbitrary string to get the save button to enable
      if (isDMN) {
        // DMN Modeler takes a callback
        this.modeler.importXML(xml, (e, w) => this.onImport(e, w || e && e.warnings));
      } else {
        // BPMN Modeler returns a Promise
        this.modeler.importXML(xml).then(
          (e, w) => this.onImport(e, w || e && e.warnings),
          e => this.onImport(e, e && e.warnings),
        );
      }
    });
  }

  async saveSVG() {
    await this.saveDiagram();
    const {svg} = await this.modeler.saveSVG();
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    this._fileSaveAs(blob, this.insertDateIntoFileName());
  }

  async saveDiagram() {
    if (this.modeler && this.modeler.saveSVG) {
      const {svg} = await this.modeler.saveSVG();
      this.svg = svg;
    }

    const {xml} = await this.modeler.saveXML({format: true});
    this.xml = xml;
    this.writeValue(xml);
  }

  async saveXML() {
    await this.saveDiagram();
    const {xml} = await this.modeler.saveXML({format: true})
    const blob = new Blob([xml], {type: 'text/xml'});
    this._fileSaveAs(blob, this.insertDateIntoFileName());
  }

  onImport(err?: Error | BpmnError, warnings?: BpmnWarning[]) {
    warnings = warnings || [];

    // SUCCESS (no errors or warnings)
    // -----------------------------------------
    // err = {warnings: []}
    // warnings = []
    // -----------------------------------------
    // err = undefined
    // warnings = []
    // -----------------------------------------

    // ERROR
    // -----------------------------------------
    // err = {warnings: [{message: '...', error: {stack '...', message: '...'}}]}
    // warnings = [{message: '...', error: {stack '...', message: '...'}}]
    // -----------------------------------------

    // SUCCESS WITH WARNINGS
    // -----------------------------------------
    // err = {warnings: [{message: '...', error: {}}]
    // warnings = [{message: '...', error: {}}]
    // -----------------------------------------
    // err = undefined
    // warnings = [{message: '...', error: {}}]
    // -----------------------------------------
    const isSuccess = (!err || isEqual(err, {warnings: []})) && isEqual(warnings, []);
    const isError = !isSuccess && err && (
      err instanceof Error ||
      err.warnings && err.warnings.some(w => w.error && !isEqual(w.error, {}))
    );

    if (isSuccess && !isError) {
      this._handleSuccess();
    } else if (isError) {
      const errors = err || warnings.filter(w => !!w.error);
      this._handleErrors(errors);
    } else {
      this._handleWarnings(warnings);
    }
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string) {
    this.api.getStringFromUrl(url).subscribe(
      xml => {
        const diagramType = getDiagramTypeFromXml(xml);
        this.openDiagram(xml, diagramType);
      },
      error => this._handleErrors(error)
    );
  }

  private _handleSuccess() {
    this.importDone.emit({
      type: 'success',
      warnings: [],
    });
  }

  private _handleWarnings(warnings: BpmnWarning[]) {
    this.importDone.emit({
      type: 'success',
      warnings: warnings || [],
    });
  }

  private _handleErrors(err) {
    this.importDone.emit({
      type: 'error',
      error: err,
    });
  }

  private initializeBPMNModeler(): BpmnModeler {
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
    const eventBus = this.modeler.get('eventBus');

    eventBus.on('editor.scripts.request', () => {
      this.api.listScripts().subscribe((data) => {
        data.forEach(element => {
          element.name = CameltoSnakeCase(element.name);
        });
        this.modeler.get('eventBus').fire('editor.scripts.response', {scripts: data});
      });
    });

    eventBus.on('editor.validation.request', (request) => {
      this.validationStart.emit(request.task_name);
    });

    return this.modeler as BpmnModeler;
  }


  private initializeDMNModeler(): DmnModeler {
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

    return this.modeler as DmnModeler;
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

  private _fileSaveAs(blob: Blob, filename: string) {
    fileSaver.saveAs(blob, filename);
  };

}
