import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptDocDialogComponent } from './script-doc-dialog.component';

describe('ScriptDocDialogComponent', () => {
  let component: ScriptDocDialogComponent;
  let fixture: ComponentFixture<ScriptDocDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptDocDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptDocDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
