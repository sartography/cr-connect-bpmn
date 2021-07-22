import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {mockFileMeta0} from 'sartography-workflow-lib';
import {DeleteFileDialogData} from '../../_interfaces/dialog-data';

import { DeleteFileDialogComponent } from './delete-file-dialog.component';

describe('DeleteFileDialogComponent', () => {
  let component: DeleteFileDialogComponent;
  let fixture: ComponentFixture<DeleteFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [ DeleteFileDialogComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: {
          confirm: false,
          fileMeta: mockFileMeta0,
        }},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm deletion on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: DeleteFileDialogData = {confirm: true, fileMeta: mockFileMeta0};
    component.data.fileMeta = mockFileMeta0;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
