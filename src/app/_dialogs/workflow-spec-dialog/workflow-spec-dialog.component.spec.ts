import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {ApiService, MockEnvironment, mockWorkflowSpec0, mockWorkflowSpecCategories} from 'sartography-workflow-lib';
import {WorkflowSpecDialogData} from '../../_interfaces/dialog-data';

import {WorkflowSpecDialogComponent} from './workflow-spec-dialog.component';

describe('WorkflowSpecDialogComponent', () => {
  let httpMock: HttpTestingController;
  let component: WorkflowSpecDialogComponent;
  let fixture: ComponentFixture<WorkflowSpecDialogComponent>;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormlyModule.forRoot(),
        FormlyMaterialModule,
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
      declarations: [WorkflowSpecDialogComponent],
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
    fixture = TestBed.createComponent(WorkflowSpecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const catReq = httpMock.expectOne('apiRoot/workflow-specification-category');
    expect(catReq.request.method).toEqual('GET');
    catReq.flush(mockWorkflowSpecCategories);
    expect(component.categories.length).toBeGreaterThan(0);
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
