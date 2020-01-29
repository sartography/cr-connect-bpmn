import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockFileMeta0, mockFileMetas, mockWorkflowSpec0} from 'sartography-workflow-lib';
import {DeleteFileDialogComponent} from '../_dialogs/delete-file-dialog/delete-file-dialog.component';
import {GetIconCodePipe} from '../_pipes/get-icon-code.pipe';
import {FileListComponent} from './file-list.component';

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
    httpMock = TestBed.get(HttpTestingController);
    component.workflowSpec = mockWorkflowSpec0;
    fixture.detectChanges();

    const fmsReq = httpMock.expectOne(`apiRoot/file?spec_id=${mockWorkflowSpec0.id}`);
    expect(fmsReq.request.method).toEqual('GET');
    fmsReq.flush(mockFileMetas);
    expect(component.fileMetas.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete a file', () => {
    const loadFileMetasSpy = spyOn((component as any), '_loadFileMetas').and.stub();
    (component as any)._deleteFile(mockFileMeta0);
    const fmsReq = httpMock.expectOne(`apiRoot/file/${mockFileMeta0.id}`);
    expect(fmsReq.request.method).toEqual('DELETE');
    fmsReq.flush(null);

    expect(loadFileMetasSpy).toHaveBeenCalled();
  });
});
