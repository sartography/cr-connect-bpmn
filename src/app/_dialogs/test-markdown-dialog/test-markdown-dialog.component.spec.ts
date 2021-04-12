import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMarkdownDialogComponent } from './test-markdown-dialog.component';

describe('TestMarkdownDialogComponent', () => {
  let component: TestMarkdownDialogComponent;
  let fixture: ComponentFixture<TestMarkdownDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestMarkdownDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestMarkdownDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
