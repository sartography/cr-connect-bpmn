import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {mockWorkflowSpec0} from 'sartography-workflow-lib';
import {DeleteWorkflowSpecDialogData} from '../../_interfaces/dialog-data';

import { DeleteWorkflowSpecDialogComponent } from './delete-workflow-spec-dialog.component';

describe('DeleteFileDialogComponent', () => {
  let component: DeleteWorkflowSpecDialogComponent;
  let fixture: ComponentFixture<DeleteWorkflowSpecDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [ DeleteWorkflowSpecDialogComponent ],
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
    fixture = TestBed.createComponent(DeleteWorkflowSpecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save data on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: DeleteWorkflowSpecDialogData = {confirm: true, workflowSpec: mockWorkflowSpec0};
    component.data.workflowSpec = mockWorkflowSpec0;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
