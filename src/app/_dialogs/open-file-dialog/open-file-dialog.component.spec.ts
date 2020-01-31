import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ApiService, MockEnvironment, mockFileMeta0} from 'sartography-workflow-lib';
import {OpenFileDialogData} from '../../_interfaces/dialog-data';

import { OpenFileDialogComponent } from './open-file-dialog.component';

describe('OpenFileDialogComponent', () => {
  let httpMock: HttpTestingController;
  let component: OpenFileDialogComponent;
  let fixture: ComponentFixture<OpenFileDialogComponent>;

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
      ],
      declarations: [ OpenFileDialogComponent ],
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
        {
          provide: MatDialog,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(OpenFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save data on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: OpenFileDialogData = { file: mockFileMeta0.file };

    component.diagramFile = expectedData.file;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: OpenFileDialogData = { file: mockFileMeta0.file };

    component.diagramFile = expectedData.file;
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
    expect(component.diagramFile).toBeTruthy();
    expect(component.diagramFile.name).toEqual(expectedName);
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it('should get the diagram file name', () => {
    component.diagramFile = undefined;
    expect(component.getFileName()).toEqual('Click to select a file');

    component.diagramFile = mockFileMeta0.file;
    expect(component.getFileName()).toEqual(mockFileMeta0.file.name);
  });

  it('should get a file from the file input field event', () => {
    const event = {target: {files: [mockFileMeta0.file]}};
    (component as any).onFileSelected(event);
    expect(component.diagramFile).toEqual(mockFileMeta0.file);
  });

  it('should determine if a string is a valid URL', () => {
    component.url = 'badurl';
    expect(component.isValidUrl()).toEqual(false);

    component.url = 'http://this-is-a.very-excellent-valid-good-url.com:8080/my_file_name.xml';
    expect(component.isValidUrl()).toEqual(true);
  });
});
