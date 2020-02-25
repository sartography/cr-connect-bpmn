import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {of} from 'rxjs';
import {ApiService, MockEnvironment, mockUser} from 'sartography-workflow-lib';
import {EmailValidator, EmailValidatorMessage} from '../_forms/validators/formly.validator';
import {SignInComponent} from './sign-in.component';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let httpMock: HttpTestingController;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignInComponent],
      imports: [
        BrowserAnimationsModule,
        FormlyModule.forRoot({
          validators: [
            {name: 'email', validation: EmailValidator},
          ],
          validationMessages: [
            {name: 'email', message: EmailValidatorMessage},
          ],
        }),
        FormlyMaterialModule,
        HttpClientTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        ApiService,
        {
          provide: ActivatedRoute,
          useValue: {paramMap: of(convertToParamMap({study_id: '0', workflow_id: '0', task_id: '0'}))}
        },
        {
          provide: Router,
          useValue: mockRouter
        },
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fake sign in during testing', () => {
    const openSessionSpy = spyOn((component as any).api, 'openSession').and.stub();
    (component as any).environment.production = false;
    component.model = mockUser;
    component.signIn();
    expect(openSessionSpy).toHaveBeenCalledWith(mockUser);
    expect(component.error).toBeUndefined();
  });

  it('should display an error if sign in is called on production', () => {
    const openSessionSpy = spyOn((component as any).api, 'openSession').and.stub();
    (component as any).environment.production = true;
    component.signIn();
    expect(openSessionSpy).not.toHaveBeenCalled();
    expect(component.error).toBeTruthy();
  });

  it('should verify the user and redirect to home page on production', () => {
    const getUserSpy = spyOn((component as any).api, 'getUser').and.returnValue(of(mockUser));
    (component as any).environment.production = true;
    (component as any)._redirectOnProduction();
    expect(getUserSpy).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
