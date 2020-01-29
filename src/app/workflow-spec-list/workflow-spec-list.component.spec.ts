import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockWorkflowSpec0, mockWorkflowSpecs} from 'sartography-workflow-lib';
import {DeleteWorkflowSpecDialogComponent} from '../_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import {GetIconCodePipe} from '../_pipes/get-icon-code.pipe';
import {FileListComponent} from '../file-list/file-list.component';

import {WorkflowSpecListComponent} from './workflow-spec-list.component';

describe('WorkflowSpecListComponent', () => {
  let httpMock: HttpTestingController;
  let component: WorkflowSpecListComponent;
  let fixture: ComponentFixture<WorkflowSpecListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      declarations: [
        DeleteWorkflowSpecDialogComponent,
        FileListComponent,
        GetIconCodePipe,
        WorkflowSpecListComponent,
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
          DeleteWorkflowSpecDialogComponent,
        ]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSpecListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    fixture.detectChanges();

    const sReq = httpMock.expectOne('apiRoot/workflow-specification');
    expect(sReq.request.method).toEqual('GET');
    sReq.flush(mockWorkflowSpecs);

    expect(component.workflowSpecs.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete a workflow spec', () => {
    const loadWorkflowSpecsSpy = spyOn((component as any), '_loadWorkflowSpecs').and.stub();
    (component as any)._deleteWorkflowSpec(mockWorkflowSpec0);
    const fmsReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(fmsReq.request.method).toEqual('DELETE');
    fmsReq.flush(null);

    expect(loadWorkflowSpecsSpy).toHaveBeenCalled();
  });
});
