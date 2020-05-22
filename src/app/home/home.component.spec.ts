import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';

import {HomeComponent} from './home.component';


@Component({
  selector: 'app-sign-in',
  template: ''
})
class MockSignInComponent {
}

@Component({
  selector: 'app-workflow-spec-list',
  template: ''
})
class MockWorkflowSpecListComponent {
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        MockSignInComponent,
        MockWorkflowSpecListComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        HttpClient,
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: Router, useValue: mockRouter},
      ]
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
    const result = component.isSignedIn;
    expect(result).toBeDefined();
    expect(typeof result).toEqual('boolean');
  });
});
