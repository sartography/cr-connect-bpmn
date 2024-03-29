import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment, mockUser0} from 'sartography-workflow-lib';
import { NavbarComponent } from './navbar.component';


describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavbarComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatMenuModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {
          provide: Router,
          useValue: mockRouter
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('token', 'some_token');
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const uReq = httpMock.expectOne('apiRoot/user');
    expect(uReq.request.method).toEqual('GET');
    uReq.flush(mockUser0);
    expect(component.user).toEqual(mockUser0);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
