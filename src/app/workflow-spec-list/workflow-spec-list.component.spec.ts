import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListItem, MatListModule} from '@angular/material/list';
import {ApiService, MockEnvironment, mockWorkflowSpec0, mockWorkflowSpecs} from 'sartography-workflow-lib';
import {FileListComponent} from '../file-list/file-list.component';

import { WorkflowSpecListComponent } from './workflow-spec-list.component';

describe('WorkflowSpecListComponent', () => {
  let httpMock: HttpTestingController;
  let component: WorkflowSpecListComponent;
  let fixture: ComponentFixture<WorkflowSpecListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatListModule,
      ],
      declarations: [
        FileListComponent,
        WorkflowSpecListComponent
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment}
      ]
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
    const loadWorkflowSpecsSpy = spyOn((component as any), 'loadWorkflowSpecs').and.stub();
    component.deleteWorkflowSpec(mockWorkflowSpec0.id);
    const fmsReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(fmsReq.request.method).toEqual('DELETE');
    fmsReq.flush(null);

    expect(loadWorkflowSpecsSpy).toHaveBeenCalled();
  });
});
