import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TestEmailDialogComponent } from './test-email-dialog.component';

describe('TestEmailDialogComponent', () => {
  let component: TestEmailDialogComponent;
  let fixture: ComponentFixture<TestEmailDialogComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestEmailDialogComponent ],
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
    fixture = TestBed.createComponent(TestEmailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
