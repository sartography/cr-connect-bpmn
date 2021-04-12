import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestEmailDialogComponent } from './test-email-dialog.component';

describe('TestEmailDialogComponent', () => {
  let component: TestEmailDialogComponent;
  let fixture: ComponentFixture<TestEmailDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestEmailDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
