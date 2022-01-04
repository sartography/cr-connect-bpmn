import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {mockWorkflowSpecCategory0} from 'sartography-workflow-lib';
import {DeleteWorkflowSpecCategoryDialogData} from '../../_interfaces/dialog-data';

import {DeleteWorkflowSpecCategoryDialogComponent} from './delete-workflow-spec-category-dialog.component';

describe('DeleteFileDialogComponent', () => {
  let component: DeleteWorkflowSpecCategoryDialogComponent;
  let fixture: ComponentFixture<DeleteWorkflowSpecCategoryDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [DeleteWorkflowSpecCategoryDialogComponent],
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
    fixture = TestBed.createComponent(DeleteWorkflowSpecCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save data on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: DeleteWorkflowSpecCategoryDialogData = {confirm: true, category: mockWorkflowSpecCategory0};
    component.data.category = mockWorkflowSpecCategory0;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
