import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugNode } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {
  ApiService,
  FileMeta,
  FileType,
  MockEnvironment,
  mockFile0,
  mockFileMeta0,
  mockFileMetas,
  mockWorkflowSpec0,
  mockWorkflowSpecs,
} from 'sartography-workflow-lib';
import { BPMN_DIAGRAM, BPMN_DIAGRAM_EMPTY } from '../../testing/mocks/diagram.mocks';
import { FileMetaDialogComponent } from '../_dialogs/file-meta-dialog/file-meta-dialog.component';
import { NewFileDialogComponent } from '../_dialogs/new-file-dialog/new-file-dialog.component';
import { OpenFileDialogComponent } from '../_dialogs/open-file-dialog/open-file-dialog.component';
import { BpmnWarning } from '../_interfaces/bpmn-warning';
import { FileMetaDialogData, NewFileDialogData, OpenFileDialogData } from '../_interfaces/dialog-data';
import { GetIconCodePipe } from '../_pipes/get-icon-code.pipe';
import { DiagramComponent } from '../diagram/diagram.component';
import { ModelerComponent } from './modeler.component';


describe('ModelerComponent', () => {
  let fixture: ComponentFixture<ModelerComponent>;
  let component: DebugNode['componentInstance'];
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DiagramComponent,
        FileMetaDialogComponent,
        NewFileDialogComponent,
        OpenFileDialogComponent,
        GetIconCodePipe,
        ModelerComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatBottomSheetModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            },
          },
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
        {
          provide: MatBottomSheetRef,
          useValue: {
            dismiss: () => {
            },
          },
        },
        {provide: MAT_BOTTOM_SHEET_DATA, useValue: []},
        {
          provide: ActivatedRoute, useValue: {
            queryParams: of(convertToParamMap({
              action: '',
            })),
            paramMap: of(convertToParamMap({
              workflowSpecId: mockWorkflowSpec0.id,
              fileMetaId: `${mockFileMeta0.id}`,
            })),
          },
        },
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          FileMetaDialogComponent,
          NewFileDialogComponent,
          OpenFileDialogComponent,
        ],
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ModelerComponent);
    component = fixture.debugElement.componentInstance;
    component.diagramComponent = TestBed.createComponent(DiagramComponent).componentInstance;
    fixture.detectChanges();

    const wfsReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(wfsReq.request.method).toEqual('GET');
    wfsReq.flush(mockWorkflowSpec0);
    expect(component.workflowSpec).toEqual(mockWorkflowSpec0);

    const req = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}/file?workflow_spec_id=${mockWorkflowSpec0.id}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockFileMetas);

  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('renders a diagram component', () => {
    expect(fixture.nativeElement.querySelector('app-diagram')).toBeTruthy();
  });


  it('sets an error message', () => {
    const error = new HttpErrorResponse({error: 'ERROR'});

    component.handleImported({
      type: 'error',
      error,
    });

    expect(component.importError).toEqual(error);
  });

  it('sets warning messages', () => {
    const warnings: BpmnWarning[] = [{
      message: 'WARNING',
    }];

    component.handleImported({
      type: 'success',
      error: null,
      warnings,
    });

    expect(component.importWarnings).toEqual(warnings);
  });


  it('loads a diagram from File', () => {
    const readFileSpy = spyOn(component, 'readFile').and.stub();
    const newFile = new File([BPMN_DIAGRAM], 'filename.xml', {type: 'text/xml'});
    component.diagramFile = newFile;
    component.openMethod = 'file';
    component.onSubmitFileToOpen();
    expect(readFileSpy).toHaveBeenCalledWith(newFile);
  });

  it('opens a diagram from File', () => {
    const mockFileReader = {
      target: {result: BPMN_DIAGRAM},
      readAsText: (blob) => {
      },
    };
    spyOn((window as any), 'FileReader').and.returnValue(mockFileReader);
    spyOn(mockFileReader, 'readAsText').and.callFake((blob) => {
      component.onLoad({target: {result: BPMN_DIAGRAM}});
    });
    const openDiagramSpy = spyOn(component.diagramComponent, 'openDiagram').and.stub();
    const newFile = new File([BPMN_DIAGRAM], 'filename.xml', {type: 'text/xml'});
    component.diagramFileMeta = mockFileMeta0;
    component.readFile(newFile);
    expect(openDiagramSpy).toHaveBeenCalledWith(BPMN_DIAGRAM, FileType.BPMN);
  });

  it('loads a diagram from File with error', () => {
    const handleImportedSpy = spyOn(component, 'handleImported').and.stub();

    component.diagramFile = new File([], 'filename.jpg', {type: 'image/jpeg'});
    component.openMethod = 'file';
    component.onSubmitFileToOpen();
    const expectedParams = {
      type: 'error',
      error: new Error('Wrong file type. Please choose a BPMN XML file.'),
    };
    expect(handleImportedSpy).toHaveBeenCalledWith(expectedParams);
  });

  it('should get the diagram file from the file input form control', () => {
    const expectedFile = new File([], 'filename.jpg', {type: 'image/jpeg'});
    const event = {target: {files: [expectedFile]}};
    component.onFileSelected(event);
    expect(component.diagramFile).toEqual(expectedFile);
  });

  it('should update the diagram file on change', () => {
    const valBefore = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'raindrops_on_roses');
    component.diagramComponent.writeValue(valBefore);
    expect(component.diagramComponent.value).toEqual(valBefore);

    const newValue = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'whiskers_on_kittens');
    component.diagramComponent.writeValue(newValue);

    expect(component.diagramComponent.value).toEqual(newValue);
    expect(component.draftXml).toEqual(newValue);
  });

  it('should save file changes when existing diagram is modified and then saved', () => {
    const saveFileChangesSpy = spyOn(component, 'saveFileChanges').and.stub();
    const editFileMetaSpy = spyOn(component, 'editFileMeta').and.stub();
    const val = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'bright_copper_kettles');
    component.diagramComponent.xml = val;
    component.workflowSpec = mockWorkflowSpec0;
    component.diagramFileMeta = mockFileMeta0;

    const newerValue = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'warm_woolen_mittens');
    component.diagramComponent.writeValue(newerValue);
    expect(component.diagramComponent.value).toEqual(newerValue);
    component.saveChanges();

    expect(saveFileChangesSpy).toHaveBeenCalled();
    expect(editFileMetaSpy).not.toHaveBeenCalled();
  });

  it('should open file metadata dialog when new diagram is saved', () => {
    const saveFileChangesSpy = spyOn(component, 'saveFileChanges').and.stub();
    const editFileMetaSpy = spyOn(component, 'editFileMeta').and.stub();

    component.newDiagram(FileType.BPMN);
    expect(component.diagramFileMeta).toBeFalsy();

    const val = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'brown_paper_packages_tied_up_with_strings');
    component.diagramComponent.writeValue(val);
    expect(component.diagramComponent.value).toEqual(val);
    component.saveChanges();

    expect(saveFileChangesSpy).not.toHaveBeenCalled();
    expect(editFileMetaSpy).toHaveBeenCalled();
  });

  it('should save file changes', () => {
    const updateFileDataSpy = spyOn(component.api, 'updateSpecFileData').and.returnValue(of(mockFileMeta0));
    const snackBarOpenSpy = spyOn(component.snackBar, 'open').and.stub();

    component.workflowSpec = mockWorkflowSpec0;
    component.diagramFileMeta = mockFileMeta0;
    component.diagramComponent.writeValue(BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'cream_colored_ponies'));
    component.saveFileChanges();

    expect(updateFileDataSpy).toHaveBeenCalledWith(mockWorkflowSpec0, mockFileMeta0, mockFile0);
    expect(snackBarOpenSpy).toHaveBeenCalled();
  });

  it('should open file metadata dialog', () => {
    const data: FileMetaDialogData = {
      fileName: 'after',
      fileType: FileType.BPMN,
    };

    const upsertSpy = spyOn(component, '_upsertFileMeta').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(data)});
    component.editFileMeta();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(upsertSpy).toHaveBeenCalledWith(data);
  });

  it('should update file metadata for existing file', () => {
    const newXml = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'crisp_apple_strudels');
    const data: FileMetaDialogData = {
      fileName: mockFileMeta0.name,
      fileType: FileType.BPMN,
    };

    const updateFileMetaSpy = spyOn(component.api, 'updateSpecFileMeta')
      .and.returnValue(of(mockFileMeta0));
    const updateFileDataSpy = spyOn(component.api, 'updateSpecFileData')
      .and.returnValue(of(mockFile0));
    const loadFilesFromDbSpy = spyOn(component, 'loadFilesFromDb').and.stub();
    const snackBarSpy = spyOn(component.snackBar, 'open').and.stub();
    const noDateOrVersion: FileMeta = {
      content_type: mockFileMeta0.content_type,
      name: mockFileMeta0.name,
      type: mockFileMeta0.type,
      workflow_spec_id: mockFileMeta0.workflow_spec_id,
    };

    // upsert original file
    component.draftXml = newXml;
    component._upsertFileMeta(data);

    expect(component.xml).toEqual(newXml);
    expect(updateFileMetaSpy).toHaveBeenCalledWith(mockWorkflowSpec0, noDateOrVersion, false);
    expect(updateFileDataSpy).toHaveBeenCalledWith(mockWorkflowSpec0, noDateOrVersion, mockFile0);
    expect(loadFilesFromDbSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('should load files from the database', () => {
    const mockHeaders = new HttpHeaders()
      .append('last-modified', mockFileMeta0.last_modified.toString())
      .append('content-type', mockFileMeta0.content_type);
    const mockResponse = new HttpResponse<ArrayBuffer>({
      body: new ArrayBuffer(8),
      headers: mockHeaders,
    });

    const getWorkflowSpecSpy = spyOn(component.api, 'getWorkflowSpecification')
      .and.returnValue(of(mockWorkflowSpec0));
    const getFileMetasSpy = spyOn(component.api, 'getSpecFileMetas')
      .and.returnValue(of(mockFileMetas));
    const getFileDataSpy = spyOn(component.api, 'getSpecFileData')
      .and.returnValue(of(mockResponse));
    component.loadFilesFromDb();

    expect(getWorkflowSpecSpy).toHaveBeenCalled();
    expect(component.workflowSpec).toEqual(mockWorkflowSpec0);
    expect(getFileMetasSpy).toHaveBeenCalledWith(mockWorkflowSpec0.id);


    expect(component.bpmnFiles.length).toEqual(mockFileMetas.length);
  });

  it('should load a database file', () => {
    const onSubmitFileToOpenSpy = spyOn(component, 'onSubmitFileToOpen').and.stub();
    component.workflowSpecs = mockWorkflowSpecs;
    component.loadDbFile(mockFileMeta0, mockFile0);
    expect(component.diagramFile).toEqual(mockFile0);
    expect(component.diagramFileMeta).toEqual(mockFileMeta0);
    expect(component.workflowSpec).toEqual(mockWorkflowSpec0);
    expect(onSubmitFileToOpenSpy).toHaveBeenCalled();
  });

  it('should start a new diagram', () => {
    component.xml = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'sleigh_bells');
    component.draftXml = BPMN_DIAGRAM_EMPTY.replace(/REPLACE_ME/g, 'schnitzel_with_noodles');
    component.diagramFileMeta = mockFileMeta0;
    component.diagramFile = mockFile0;
    component.workflowSpec = mockWorkflowSpec0;
    component.newDiagram();

    expect(component.xml).toBeFalsy();
    expect(component.draftXml).toBeFalsy();
    expect(component.fileName).toBeFalsy();
    expect(component.workflowSpec).toBeTruthy();
    expect(component.diagramFileMeta).toBeFalsy();
    expect(component.diagramFile).toBeFalsy();
    expect(component.diagramComponent.value).toBeFalsy();
  });

  it('should get a file metadata display string', () => {
    expect(component.getFileMetaDisplayString(undefined)).toEqual('Loading...');
    const expectedString = 'one-fish.bpmn';
    mockFileMeta0.type = FileType.BPMN;
    mockFileMeta0.last_modified = '2020-01-23T12:34:12.345Z';
    expect(component.getFileMetaDisplayString(mockFileMeta0)).toEqual(expectedString);
  });

  it('should get file metadata tooltip text', () => {
    component.workflowSpec = undefined;
    expect(component.getFileMetaTooltipText(mockFileMeta0)).toEqual('Loading...');
    mockFileMeta0.type = FileType.BPMN;
    mockFileMeta0.last_modified = '2020-01-23T12:34:12.345Z';
    const lastUpdated = new DatePipe('en-us').transform(mockFileMeta0.last_modified, 'medium');

    component.workflowSpec = mockWorkflowSpec0;
    const expectedString = `
          File name: one-fish.bpmn
          Last updated: ${lastUpdated}
          Version: 1.0
      `;
    mockFileMeta0.type = FileType.BPMN;
    mockFileMeta0.last_modified = '2020-01-23T12:34:12.345Z';
    expect(component.getFileMetaTooltipText(mockFileMeta0)).toEqual(expectedString);
  });

  it('should display new file dialog', () => {
    const data: NewFileDialogData = {
      fileType: FileType.BPMN,
    };

    const newDiagramSpy = spyOn(component, 'newDiagram').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(data)});
    component.newFileDialog();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(newDiagramSpy).toHaveBeenCalledWith(data.fileType);
  });

  it('should display open file dialog', () => {
    const data: OpenFileDialogData = {
      file: mockFile0,
    };
    const expectedFile = new File([], mockFileMeta0.name, {type: mockFileMeta0.content_type});
    const event = {target: {files: [expectedFile]}};

    const onSubmitFileToOpenSpy = spyOn(component, 'onSubmitFileToOpen').and.stub();
    component.openFileDialog();
    expect(component.requestFileClick).toBeTrue();
    component.onFileSelected(event);
    expect(component.diagramFile).toEqual(data.file);
    expect(onSubmitFileToOpenSpy).toHaveBeenCalled();
  });

  it('should trigger open file dialog from query params', () => {
    const openFileDialogSpy = spyOn(component, 'openFileDialog').and.stub();
    component._handleAction({action: 'openFile'});
    expect(openFileDialogSpy).toHaveBeenCalled();
  });

  it('should trigger new file dialog from query params', () => {
    const newFileDialogSpy = spyOn(component, 'newFileDialog').and.stub();
    component._handleAction({action: 'newFile'});
    expect(newFileDialogSpy).toHaveBeenCalled();
  });

});
