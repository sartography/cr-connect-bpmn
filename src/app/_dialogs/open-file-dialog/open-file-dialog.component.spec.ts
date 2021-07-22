import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockFile0, mockFileMeta0} from 'sartography-workflow-lib';
import {OpenFileDialogData} from '../../_interfaces/dialog-data';

import { OpenFileDialogComponent } from './open-file-dialog.component';

describe('OpenFileDialogComponent', () => {
  let httpMock: HttpTestingController;
  let component: OpenFileDialogComponent;
  let fixture: ComponentFixture<OpenFileDialogComponent>;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [ OpenFileDialogComponent ],
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
        {
          provide: MatDialog,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
        {provide: Router, useValue: mockRouter},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OpenFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save data on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.data.file = mockFile0;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(component.data);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: OpenFileDialogData = { file: mockFile0 };

    component.data.file = expectedData.file;
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });

  it('should load XML from URL, then set and clean up filename', () => {
    const url = 'whatever/ 🍳 green_eggs.v1-2020-01-01.XML.bmnp 🍖 ';
    const expectedName = 'green_eggs.v1-2020-01-01.XML.bpmn';
    const onSubmitSpy = spyOn(component, 'onSubmit').and.stub();

    component.url = url;
    component.onSubmitUrl();
    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('GET');
    req.flush('<xml></xml>');
    expect(component.data.file).toBeTruthy();
    expect(component.data.file.name).toEqual(expectedName);
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it('should get the diagram file name', () => {
    component.data.file = undefined;
    expect(component.getFileName()).toEqual('Click to select a file');

    component.data.file = mockFile0;
    expect(component.getFileName()).toEqual(mockFile0.name);
  });

  it('should get a file from the file input field event', () => {
    const event = {target: {files: [mockFile0]}};
    (component as any).onFileSelected(event);
    expect(component.data.file).toEqual(mockFile0);
  });

  it('should determine if a string is a valid URL', () => {
    component.url = 'badurl';
    expect(component.isValidUrl()).toEqual(false);

    component.url = 'http://this-is-a.very-excellent-valid-good-url.com:8080/my_file_name.xml';
    expect(component.isValidUrl()).toEqual(true);
  });
});
