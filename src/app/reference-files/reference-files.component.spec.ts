import {APP_BASE_HREF} from '@angular/common';
import {HttpHeaders} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import * as FileSaver from 'file-saver';
import * as cloneDeep from 'lodash/cloneDeep';
import {of} from 'rxjs';
import {ApiService, FileMeta, FileType, MockEnvironment, mockFileMetaReference0, mockFileReference0} from 'sartography-workflow-lib';
import {OpenFileDialogComponent} from '../_dialogs/open-file-dialog/open-file-dialog.component';
import {ReferenceFilesComponent} from './reference-files.component';

describe('ReferenceFilesComponent', () => {
  let httpMock: HttpTestingController;
  let component: ReferenceFilesComponent;
  let fixture: ComponentFixture<ReferenceFilesComponent>;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  // Mock file and response headers
  const mockDocMeta: FileMeta = cloneDeep(mockFileMetaReference0);
  mockDocMeta.type = FileType.XLSX;

  const timeString = '2020-01-23T12:34:12.345Z';
  const timeCode = new Date(timeString).getTime();

  const expectedFile = new File([], mockDocMeta.name, {
    type: mockDocMeta.content_type,
    lastModified: timeCode
  });

  const mockHeaders = new HttpHeaders()
    .append('last-modified', expectedFile.lastModified.toString())
    .append('content-type', mockDocMeta.content_type);

  const mockArrayBuffer = new ArrayBuffer(8);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      declarations: [
        OpenFileDialogComponent,
        ReferenceFilesComponent,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
        {provide: Router, useValue: mockRouter},
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          OpenFileDialogComponent,
        ]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceFilesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne('apiRoot/reference_file');
    expect(req.request.method).toEqual('GET');
    req.flush([mockFileMetaReference0]);
    expect(component.referenceFiles.length).toEqual(1);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update existing file from file dialog', () => {
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({
        afterClosed: () => of({
          fileMetaId: mockFileMetaReference0.id,
          file: mockFileReference0
        })
      } as any);
    const _loadReferenceFilesSpy = spyOn((component as any), '_loadReferenceFiles').and.stub();

    component.openFileDialog(mockFileMetaReference0);

    const fReq = httpMock.expectOne(`apiRoot/reference_file/${mockDocMeta.name}`);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockArrayBuffer, {headers: mockHeaders});

    const updateReq = httpMock.expectOne(`apiRoot/reference_file/${mockFileMetaReference0.name}`);
    expect(updateReq.request.method).toEqual('PUT');
    updateReq.flush(mockArrayBuffer, {headers: mockHeaders});

    expect(openDialogSpy).toHaveBeenCalled();
    expect(_loadReferenceFilesSpy).toHaveBeenCalled();
  });

  it('should save file', () => {
    const fileSaverSpy = spyOn(FileSaver, 'saveAs').and.stub();

    component.downloadFile(mockDocMeta);

    const fReq = httpMock.expectOne(`apiRoot/reference_file/${mockDocMeta.name}`);
    expect(fReq.request.method).toEqual('GET');
    fReq.flush(mockArrayBuffer, {headers: mockHeaders});

    expect(fileSaverSpy).toHaveBeenCalled();
  });

});
