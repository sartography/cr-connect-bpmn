import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import createClone from 'rfdc';
import {FileType} from 'sartography-workflow-lib';
import {FileMetaDialogData} from '../../_interfaces/dialog-data';
import {FileMetaDialogComponent} from './file-meta-dialog.component';

describe('EditFileMetaDialogComponent', () => {
  let component: FileMetaDialogComponent;
  let fixture: ComponentFixture<FileMetaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileMetaDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
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
    fixture = TestBed.createComponent(FileMetaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save data on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const dataBefore: FileMetaDialogData = {
      fileName: 'green_eggs.bpmn',
      fileType: FileType.BPMN,
    };

    component.model = dataBefore;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(dataBefore);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const dataBefore: FileMetaDialogData = {
      fileName: 'and_ham.bpmn',
      fileType: FileType.BPMN,
    };

    component.model = dataBefore;
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });

  it('should clean up filename', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const dataBefore: FileMetaDialogData = {
      fileName: ' 🍳 green_eggs.v1-2020-01-01.XML.bmnp 🍖 ',
      fileType: FileType.BPMN,
    };

    component.model = dataBefore;
    component.onSubmit();
    const expectedData: FileMetaDialogData = createClone()(dataBefore);
    expectedData.fileName = 'green_eggs.v1-2020-01-01.XML.bpmn';
    expect(closeSpy).toHaveBeenCalledWith(expectedData);
  });
});
