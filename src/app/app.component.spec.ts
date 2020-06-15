import {APP_BASE_HREF} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {FakeMatIconRegistry} from '@angular/material/icon/testing';
import {MatMenuModule} from '@angular/material/menu';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService, MockEnvironment} from 'sartography-workflow-lib';
import {AppComponent} from './app.component';
import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockEnvironment = new MockEnvironment();
  const mockTitle = `'Once,' said the Mock Title at last, with a deep sigh, 'I was a real Title.'`;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FooterComponent,
        NavbarComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatMenuModule,
        RouterTestingModule,
      ],
      providers: [
        HttpClient,
        FakeMatIconRegistry,
        ApiService,
        {provide: 'APP_ENVIRONMENT', useValue: mockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    mockEnvironment.title = mockTitle;
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should set the page title to match environment variable`, () => {
    expect((component as any).titleService.getTitle()).toEqual(mockTitle);
  });
});
