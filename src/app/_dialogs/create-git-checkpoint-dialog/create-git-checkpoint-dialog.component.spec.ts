import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGitCheckpointDialogComponent } from './create-git-checkpoint-dialog.component';

describe('CreateGitCheckpointDialogComponent', () => {
  let component: CreateGitCheckpointDialogComponent;
  let fixture: ComponentFixture<CreateGitCheckpointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGitCheckpointDialogComponent ]
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
