import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceFilesComponent } from './reference-files.component';

describe('ReferenceFilesComponent', () => {
  let component: ReferenceFilesComponent;
  let fixture: ComponentFixture<ReferenceFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
