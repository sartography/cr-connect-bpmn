import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtocolBuilderComponent } from './protocol-builder.component';

describe('ProtocolBuilderComponentComponent', () => {
  let component: ProtocolBuilderComponent;
  let fixture: ComponentFixture<ProtocolBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtocolBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtocolBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
