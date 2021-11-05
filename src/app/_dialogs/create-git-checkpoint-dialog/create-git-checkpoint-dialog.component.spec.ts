import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGitCheckpointDialogComponent } from './create-git-checkpoint-dialog.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MdDialogMock} from '../../workflow-spec-list/workflow-spec-list.component.spec';

describe('CreateGitCheckpointDialogComponent', () => {
  let component: CreateGitCheckpointDialogComponent;
  let fixture: ComponentFixture<CreateGitCheckpointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGitCheckpointDialogComponent ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
      ],
      providers : [
        {
          provide: MatDialogRef, useClass: MdDialogMock,
        },

      ]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGitCheckpointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
