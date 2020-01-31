import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {mockWorkflowSpec0} from 'sartography-workflow-lib';
import {WorkflowSpecDialogData} from '../../_interfaces/dialog-data';

import { WorkflowSpecDialogComponent } from './workflow-spec-dialog.component';

describe('WorkflowSpecDialogComponent', () => {
  let component: WorkflowSpecDialogComponent;
  let fixture: ComponentFixture<WorkflowSpecDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [ WorkflowSpecDialogComponent ],
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
    fixture = TestBed.createComponent(WorkflowSpecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save data on submit', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    const expectedData: WorkflowSpecDialogData = mockWorkflowSpec0 as WorkflowSpecDialogData;
    component.model = expectedData;
    component.onSubmit();
    expect(closeSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should not change data on cancel', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
