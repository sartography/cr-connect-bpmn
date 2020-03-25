import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {
  ApiService,
  FileMeta,
  FileType,
  MockEnvironment,
  mockFileMeta0,
  mockFileMetas,
  mockWorkflowSpec0
} from 'sartography-workflow-lib';
import {DeleteFileDialogComponent} from '../_dialogs/delete-file-dialog/delete-file-dialog.component';
import {DeleteFileDialogData} from '../_interfaces/dialog-data';
import {GetIconCodePipe} from '../_pipes/get-icon-code.pipe';
import {FileListComponent} from './file-list.component';
import createClone from 'rfdc';


describe('FileListComponent', () => {
  let httpMock: HttpTestingController;
  let component: FileListComponent;
  let fixture: ComponentFixture<FileListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      declarations: [
        DeleteFileDialogComponent,
        FileListComponent,
        GetIconCodePipe,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          DeleteFileDialogComponent,
        ]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    component.workflowSpec = mockWorkflowSpec0;
    fixture.detectChanges();

    const justFiles: File[] = [];
    const fmsNoFiles: FileMeta[] = mockFileMetas.map(fm => {
      justFiles.push(fm.file);
      delete fm['file'];
      return fm;
    });
    expect(justFiles.length).toEqual(mockFileMetas.length);
    expect(fmsNoFiles.every(fm => !fm.file)).toEqual(true);
    expect(justFiles.every(f => !!f.name)).toEqual(true);

    const fmsReq = httpMock.expectOne(`apiRoot/file?workflow_spec_id=${mockWorkflowSpec0.id}`);
    expect(fmsReq.request.method).toEqual('GET');
    fmsReq.flush(fmsNoFiles);
    expect(component.fileMetas.length).toBeGreaterThan(0);

    fmsNoFiles.forEach((fm, i) => {
      const fReq = httpMock.expectOne(`apiRoot/file/${fm.id}/data`);
      expect(fReq.request.method).toEqual('GET');
      fReq.flush(justFiles[i]);
      expect(component.fileMetas[i].file).toBeTruthy();
    });
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort files by name', () => {
    let prevFileMeta;

    for (const thisFileMeta of component.fileMetas) {
      if (!prevFileMeta) {
        prevFileMeta = thisFileMeta;
      } else {
        expect(thisFileMeta.name).toBeGreaterThan(prevFileMeta.name);
        prevFileMeta = thisFileMeta;
      }
    }
  });

  it('should show a confirmation dialog before deleting a file', () => {
    const mockConfirmDeleteData: DeleteFileDialogData = {
      confirm: false,
      fileMeta: mockFileMeta0,
    };

    const _deleteFileSpy = spyOn((component as any), '_deleteFile').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockConfirmDeleteData)} as any);

    component.confirmDelete(mockFileMeta0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteFileSpy).not.toHaveBeenCalled();

    mockConfirmDeleteData.confirm = true;
    component.confirmDelete(mockFileMeta0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteFileSpy).toHaveBeenCalled();
  });

  it('should delete a file', () => {
    const loadFileMetasSpy = spyOn((component as any), '_loadFileMetas').and.stub();
    (component as any)._deleteFile(mockFileMeta0);
    const fmsReq = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}`);
    expect(fmsReq.request.method).toEqual('DELETE');
    fmsReq.flush(null);

    expect(loadFileMetasSpy).toHaveBeenCalled();
  });

  it('should navigate to modeler to edit a BPMN or DMN file', () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate');
    component.workflowSpec = mockWorkflowSpec0;
    component.editFile(mockFileMeta0);
    expect(routerNavigateSpy).toHaveBeenCalledWith([`/modeler/${mockWorkflowSpec0.id}/${mockFileMeta0.id}`]);

    routerNavigateSpy.calls.reset();
    const mockDmnMeta = createClone()(mockFileMeta0);
    mockDmnMeta.type = FileType.DMN;
    component.editFile(mockDmnMeta);
    expect(routerNavigateSpy).toHaveBeenCalledWith([`/modeler/${mockWorkflowSpec0.id}/${mockDmnMeta.id}`]);
  });

  it('should open file metadata dialog for non-BPMN files', () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate');
    const editFileMetaSpy = spyOn(component, 'editFileMeta');
    component.workflowSpec = mockWorkflowSpec0;
    const mockDocMeta = createClone()(mockFileMeta0);
    mockDocMeta.type = FileType.DOCX;
    component.editFile(mockDocMeta);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(editFileMetaSpy).toHaveBeenCalledWith(mockDocMeta);

    routerNavigateSpy.calls.reset();
    editFileMetaSpy.calls.reset();
    component.editFile(null);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(editFileMetaSpy).toHaveBeenCalledWith(null);
  });

  it('should change route and then open file metadata dialog', () => {
    const routerNavigateSpy = spyOn((component as any).router, 'navigate')
      .and.returnValue({finally: finallyCallback => finallyCallback()});
    const _openFileDialogSpy = spyOn((component as any), '_openFileDialog').and.stub();
    component.workflowSpec = mockWorkflowSpec0;
    const mockDocMeta = createClone()(mockFileMeta0);
    mockDocMeta.type = FileType.DOCX;
    component.editFileMeta(mockDocMeta);
    expect(routerNavigateSpy).toHaveBeenCalled();

    const fakeBlob = new Blob(['I am a fake blob. A real blob says "blorp blorp blorp."']);
    const fReq = httpMock.expectOne(`apiRoot/file/${mockDocMeta.id}/data`);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(fakeBlob);
    expect(_openFileDialogSpy).toHaveBeenCalledWith(mockDocMeta, fakeBlob);

    routerNavigateSpy.calls.reset();
    _openFileDialogSpy.calls.reset();

    component.editFileMeta(null);
    expect(routerNavigateSpy).toHaveBeenCalled();
    expect(_openFileDialogSpy).toHaveBeenCalledWith();
  });

  it('should flag a file as primary', () => {
    const updateFileMetaSpy = spyOn((component as any).api, 'updateFileMeta').and.returnValue(of(mockFileMeta0));
    const _loadFileMetasSpy = spyOn((component as any), '_loadFileMetas').and.stub();
    expect(component.fileMetas.length).toEqual(mockFileMetas.length);
    component.makePrimary(mockFileMeta0);

    expect(updateFileMetaSpy).toHaveBeenCalledTimes(mockFileMetas.length);
    expect(component.fileMetas.length).toEqual(mockFileMetas.length);
    expect(component.fileMetas.every(fm => !!fm.file)).toEqual(true);
    expect(component.fileMetas.reduce((sum, fm) => fm.primary ? sum + 1 : sum, 0)).toEqual(1);
    expect(_loadFileMetasSpy).toHaveBeenCalled();
  });
});
