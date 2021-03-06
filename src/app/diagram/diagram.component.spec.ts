import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DebugNode} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import * as FileSaver from 'file-saver';
import {ApiService, BPMN_DIAGRAM_DEFAULT, FileType, MockEnvironment} from 'sartography-workflow-lib';
import {
  BPMN_DIAGRAM,
  BPMN_DIAGRAM_WITH_WARNINGS,
  DMN_DIAGRAM,
  DMN_DIAGRAM_WITH_WARNINGS
} from '../../testing/mocks/diagram.mocks';
import {DiagramComponent} from './diagram.component';

describe('DiagramComponent', () => {
  let httpMock: HttpTestingController;
  let fixture: ComponentFixture<DiagramComponent>;
  let component: DebugNode['componentInstance'];
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule,
      ],
      declarations: [DiagramComponent],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
        {provide: Router, useValue: mockRouter},
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(DiagramComponent);
    component = fixture.debugElement.componentInstance;
    component.fileName = '';
    fixture.detectChanges();
  }));

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create and tear down', () => {
    expect(component).toBeTruthy();
  });

  it('should load and render BPMN successfully', (done) => {
    const diagramURL = 'some-url';
    component.importDone.subscribe(result => {
      expect(result).toEqual({
        type: 'success',
        warnings: []
      });
      done();
    });

    component.loadUrl(diagramURL);
    const request = httpMock.expectOne({url: diagramURL, method: 'GET'});
    request.flush(BPMN_DIAGRAM);
  });

  it('should load and render DMN successfully', (done) => {
    const diagramURL = 'some-url';
    component.importDone.subscribe(result => {
      expect(result).toEqual({
        type: 'success',
        warnings: []
      });
      done();
    });

    component.loadUrl(diagramURL);
    const request = httpMock.expectOne({url: diagramURL, method: 'GET'});
    request.flush(DMN_DIAGRAM);
  });

  it('should expose BPMN import warnings', (done) => {
    const diagramURL = 'some-url';
    component.importDone.subscribe(result => {
      expect(result.type).toEqual('success');
      expect(result.warnings.length).toEqual(1);
      expect(result.warnings[0].message).toContain('unparsable content <process> detected');
      done();
    });
    component.loadUrl(diagramURL);

    const request = httpMock.expectOne({url: diagramURL, method: 'GET'});
    request.flush(BPMN_DIAGRAM_WITH_WARNINGS);
  });

  it('should expose DMN import warnings', (done) => {
    const diagramURL = 'some-url';
    component.importDone.subscribe(result => {
      expect(result.type).toEqual('success');
      expect(result.warnings.length).toEqual(1);
      expect(result.warnings[0].message).toContain('unparsable content <decision> detected');
      done();
    });
    component.loadUrl(diagramURL);

    const request = httpMock.expectOne({url: diagramURL, method: 'GET'});
    request.flush(DMN_DIAGRAM_WITH_WARNINGS);
  });

  it('should fail to load and render', (done) => {
    const diagramURL = 'some-url';
    component.loadUrl(diagramURL);
    component.importDone.subscribe(result => {
      expect(result.type).toEqual('error');
      expect(result.error).toEqual('Http failure response for some-url: 404 FOO');
      done();
    });

    const request = httpMock.expectOne({url: diagramURL, method: 'GET'});
    request.flush('Not Found', {
      status: 404,
      statusText: 'FOO'
    });
  });

  it('should save diagram as SVG', () => {
    const fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();
    component.saveSVG();
    expect(fileSaverSpy).toHaveBeenCalled();
  });

  it('should save diagram as XML', () => {
    const fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();
    component.saveXML();
    expect(fileSaverSpy).toHaveBeenCalled();
  });

  it('should insert date into filename', () => {
    spyOn((component as any), '_formatDate').and.returnValue('DATESTRING');
    component.fileName = 'file name with extension.bpmn';
    component.diagramType = FileType.BPMN;
    expect((component as any).insertDateIntoFileName()).toEqual('file name with extension_DATESTRING.bpmn');

    component.fileName = 'file name with no extension';
    component.diagramType = FileType.DMN;
    expect((component as any).insertDateIntoFileName()).toEqual('file name with no extension_DATESTRING.dmn');
  });

  it('should create a new diagram', () => {
    const initializeModelerSpy = spyOn(component, 'initializeModeler').and.stub();
    const importXMLSpy = spyOn(component.modeler, 'importXML').and.stub();
    spyOn(component, 'getRandomString').and.returnValue('REPLACE_ME');
    component.openDiagram();
    expect(initializeModelerSpy).toHaveBeenCalledWith(undefined);
    expect(importXMLSpy).toHaveBeenCalledWith(BPMN_DIAGRAM_DEFAULT, jasmine.any(Function));
  });

  it('should open an existing BPMN diagram from XML', () => {
    const initializeBPMNModelerSpy = spyOn(component, 'initializeBPMNModeler').and.stub();
    const importXMLSpy = spyOn(component.modeler, 'importXML').and.stub();
    component.openDiagram(BPMN_DIAGRAM, FileType.BPMN);
    expect(initializeBPMNModelerSpy).toHaveBeenCalled();
    expect(importXMLSpy).toHaveBeenCalled();
  });

  it('should open an existing DMN diagram from XML', () => {
    const initializeDMNModelerSpy = spyOn(component, 'initializeDMNModeler').and.stub();
    const importXMLSpy = spyOn(component.modeler, 'importXML').and.stub();
    component.openDiagram(DMN_DIAGRAM, FileType.DMN);
    expect(initializeDMNModelerSpy).toHaveBeenCalled();
    expect(importXMLSpy).toHaveBeenCalled();
  });

  it('should fail to open BPMN diagram', (done) => {
    component.openDiagram('INVALID BPMN XML', FileType.BPMN);
    component.importDone.subscribe(result => {
      expect(result.type).toEqual('error');
      expect(result.error.message).toContain('unparsable content INVALID BPMN XML detected');
      done();
    });
  });

  it('should fail to open DMN diagram', (done) => {
    component.openDiagram('INVALID DMN XML', FileType.DMN);
    component.importDone.subscribe(result => {
      expect(result.type).toEqual('error');
      expect(result.error.message).toContain('unparsable content INVALID DMN XML detected');
      done();
    });
  });

  it('should edit diagram', () => {
    const initializeModelerSpy = spyOn(component, 'initializeModeler').and.stub();
    const onChangeSpy = spyOn(component, 'onChange').and.stub();
    const importXMLSpy = spyOn(component.modeler, 'importXML').and.stub();
    spyOn(component, 'getRandomString').and.returnValue('REPLACE_ME');
    component.openDiagram();
    expect(initializeModelerSpy).toHaveBeenCalledWith(undefined);
    expect(importXMLSpy).toHaveBeenCalledWith(BPMN_DIAGRAM_DEFAULT, jasmine.any(Function));

    component.writeValue(BPMN_DIAGRAM);
    expect(initializeModelerSpy).toHaveBeenCalledWith(undefined);
    expect(onChangeSpy).toHaveBeenCalled();
  });

  it('should register onChange function', () => {
    const fn = (s: string) => s.toLowerCase().trim();
    const input = '   TRIMMED AND LOWERCASED   ';

    component.registerOnChange(fn);
    expect(component.onChange).toEqual(fn);

    const result = component.onChange(input);
    expect(result).toEqual('trimmed and lowercased');
  });

  it('should register onTouched function', () => {
    const fn = () => 123456;

    component.registerOnTouched(fn);
    expect(component.onTouched).toEqual(fn);

    const result = component.onTouched();
    expect(result).toEqual(123456);
  });

  it('should set disabled state', () => {
    component.setDisabledState(true);
    expect(component.disabled).toEqual(true);

    component.setDisabledState(false);
    expect(component.disabled).toEqual(false);
  });

});
