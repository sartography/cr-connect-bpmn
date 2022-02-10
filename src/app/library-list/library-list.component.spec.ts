import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {ApiService, MockEnvironment, mockWorkflowSpec0, mockWorkflowSpec1, WorkflowSpec} from 'sartography-workflow-lib';
import {LibraryListComponent} from './library-list.component';



describe('LibraryListComponent', () => {
  let component: LibraryListComponent;
  let fixture: ComponentFixture<LibraryListComponent>;
  let httpMock: HttpTestingController;
  let libraries: WorkflowSpec[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LibraryListComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatIconModule,
        MatMenuModule,
      //  RouterTestingModule,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: ''},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    localStorage.setItem('token', 'some_token');
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(LibraryListComponent);
    component = fixture.componentInstance;
    libraries = [mockWorkflowSpec0, mockWorkflowSpec1];
    libraries[0].library = true;
    libraries[1].library = true;
    component.workflowSpec = mockWorkflowSpec0;
    fixture.detectChanges();
    const uReq = httpMock.expectOne('apiRoot/workflow-specification?libraries=true');
    expect(uReq.request.method).toEqual('GET');
    uReq.flush(libraries);
    expect(component.workflowLibraries).toEqual(libraries);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
