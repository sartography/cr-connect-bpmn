import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

import {NewFileDialogComponent} from './new-file-dialog.component';

describe('NewFileDialogComponent', () => {
  let component: NewFileDialogComponent;
  let fixture: ComponentFixture<NewFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewFileDialogComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
