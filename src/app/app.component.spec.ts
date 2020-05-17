import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';
import {AppComponent} from './app.component';


@Component({
  selector: 'app-navbar',
  template: ''
})
class MockNavbarComponent {
}

@Component({
  selector: 'app-footer',
  template: ''
})
class MockFooterComponent {
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockNavbarComponent,
        MockFooterComponent
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        HttpClient,
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
