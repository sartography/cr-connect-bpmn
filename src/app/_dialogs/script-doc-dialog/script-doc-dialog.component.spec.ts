import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ScriptDocDialogComponent } from './script-doc-dialog.component';

describe('ScriptDocDialogComponent', () => {
  let component: ScriptDocDialogComponent;
  let fixture: ComponentFixture<ScriptDocDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptDocDialogComponent ],
      imports : [MatDialogModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: {
            confirm: false,
          }},
      ]

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
