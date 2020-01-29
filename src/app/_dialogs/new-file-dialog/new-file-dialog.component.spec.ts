import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {GetIconCodePipe} from '../../_pipes/get-icon-code.pipe';

import { NewFileDialogComponent } from './new-file-dialog.component';

describe('NewFileDialogComponent', () => {
  let component: NewFileDialogComponent;
  let fixture: ComponentFixture<NewFileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [
        NewFileDialogComponent,
        GetIconCodePipe,
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {
          provide: MatDialog,
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
