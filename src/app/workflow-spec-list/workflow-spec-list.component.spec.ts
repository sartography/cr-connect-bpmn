import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSpecListComponent } from './workflow-spec-list.component';

describe('WorkflowSpecListComponent', () => {
  let component: WorkflowSpecListComponent;
  let fixture: ComponentFixture<WorkflowSpecListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowSpecListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowSpecListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
