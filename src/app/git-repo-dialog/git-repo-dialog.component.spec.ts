import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitRepoDialogComponent } from './git-repo-dialog.component';

describe('GitRepoDialogComponent', () => {
  let component: GitRepoDialogComponent;
  let fixture: ComponentFixture<GitRepoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GitRepoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GitRepoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
