import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MockEnvironment} from 'sartography-workflow-lib';

import {HomeComponent} from './home.component';


@Component({
  selector: 'app-sign-in',
  template: ''
})
class MockSignInComponent {}

@Component({
  selector: 'app-workflow-spec-list',
  template: ''
})
class MockWorkflowSpecListComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockSignInComponent,
        MockWorkflowSpecListComponent,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check signed-in state', () => {
    const result = component.isSignedIn();
    expect(result).toBeDefined();
    expect(typeof result).toEqual('boolean');
  });
});
