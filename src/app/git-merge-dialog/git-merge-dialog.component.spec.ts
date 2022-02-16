import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitMergeDialogComponent } from './git-merge-dialog.component';

describe('GitMergeDialogComponent', () => {
  let component: GitMergeDialogComponent;
  let fixture: ComponentFixture<GitMergeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitMergeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GitMergeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
