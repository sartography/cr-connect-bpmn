import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowSpecDialogComponent } from './workflow-spec-dialog.component';

describe('WorkflowSpecDialogComponent', () => {
  let component: WorkflowSpecDialogComponent;
  let fixture: ComponentFixture<WorkflowSpecDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowSpecDialogComponent ]
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
});
