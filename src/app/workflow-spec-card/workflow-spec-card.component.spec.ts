import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockWorkflowSpec0} from 'sartography-workflow-lib';
import {GetIconCodePipe} from '../_pipes/get-icon-code.pipe';
import {FileListComponent} from '../file-list/file-list.component';
import {WorkflowSpecCardComponent} from './workflow-spec-card.component';

describe('WorkflowSpecCardComponent', () => {
  let component: WorkflowSpecCardComponent;
  let fixture: ComponentFixture<WorkflowSpecCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WorkflowSpecCardComponent,
        FileListComponent,
        GetIconCodePipe,
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            },
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSpecCardComponent);
    component = fixture.componentInstance;
    component.workflowSpec = mockWorkflowSpec0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
