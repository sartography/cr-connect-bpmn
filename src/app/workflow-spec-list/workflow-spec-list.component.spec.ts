import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatCardModule} from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import createClone from 'rfdc';
import {of} from 'rxjs';
import {
  ApiService,
  MockEnvironment,
  mockWorkflowSpec0,
  mockWorkflowSpec1, mockWorkflowSpecCategories, mockWorkflowSpecCategory0, mockWorkflowSpecCategory1,
  mockWorkflowSpecs
} from 'sartography-workflow-lib';
import {DeleteWorkflowSpecDialogComponent} from '../_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import {
  DeleteWorkflowSpecCategoryDialogData,
  DeleteWorkflowSpecDialogData,
  WorkflowSpecCategoryDialogData,
  WorkflowSpecDialogData
} from '../_interfaces/dialog-data';
import {GetIconCodePipe} from '../_pipes/get-icon-code.pipe';
import {ApiErrorsComponent} from '../api-errors/api-errors.component';
import {FileListComponent} from '../file-list/file-list.component';
import {WorkflowSpecListComponent} from './workflow-spec-list.component';

describe('WorkflowSpecListComponent', () => {
  let httpMock: HttpTestingController;
  let component: WorkflowSpecListComponent;
  let fixture: ComponentFixture<WorkflowSpecListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MatBottomSheetModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatListModule,
        MatSnackBarModule,
        RouterTestingModule,
      ],
      declarations: [
        ApiErrorsComponent,
        DeleteWorkflowSpecDialogComponent,
        FileListComponent,
        GetIconCodePipe,
        WorkflowSpecListComponent,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {
          provide: MatDialogRef,
          useValue: {
            close: (dialogResult: any) => {
            },
          }
        },
        {provide: MAT_DIALOG_DATA, useValue: []},
        {
          provide: MatBottomSheetRef,
          useValue: {
            dismiss: () => {
            },
          }
        },
        {provide: MAT_BOTTOM_SHEET_DATA, useValue: []},
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          ApiErrorsComponent,
          DeleteWorkflowSpecDialogComponent,
        ]
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(WorkflowSpecListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const catReq = httpMock.expectOne('apiRoot/workflow-specification-category');
    expect(catReq.request.method).toEqual('GET');
    catReq.flush(mockWorkflowSpecCategories);
    expect(component.categories.length).toBeGreaterThan(0);

    const specReq = httpMock.expectOne('apiRoot/workflow-specification');
    expect(specReq.request.method).toEqual('GET');
    specReq.flush(mockWorkflowSpecs);
    expect(component.workflowSpecs.length).toBeGreaterThan(0);
  });

  afterEach(() => {
    httpMock.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a metadata dialog when editing a workflow spec', () => {
    let mockSpecData: WorkflowSpecDialogData = {
      id: '',
      name: '',
      display_name: '',
      description: '',
      category_id: 0,
    };

    const _upsertWorkflowSpecificationSpy = spyOn((component as any), '_upsertWorkflowSpecification')
      .and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockSpecData)} as any);

    component.editWorkflowSpec(mockWorkflowSpec0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecificationSpy).not.toHaveBeenCalled();

    mockSpecData = mockWorkflowSpec0 as WorkflowSpecDialogData;
    component.editWorkflowSpec(mockWorkflowSpec0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecificationSpy).toHaveBeenCalled();
  });

  it('should edit an existing workflow spec but add a new workflow spec', () => {
    const _addWorkflowSpecSpy = spyOn((component as any), '_addWorkflowSpec').and.stub();
    const _updateWorkflowSpecSpy = spyOn((component as any), '_updateWorkflowSpec').and.stub();

    component.selectedSpec = undefined;
    (component as any)._upsertWorkflowSpecification(mockWorkflowSpec1 as WorkflowSpecDialogData);
    expect(_addWorkflowSpecSpy).toHaveBeenCalled();
    expect(_updateWorkflowSpecSpy).not.toHaveBeenCalled();

    _addWorkflowSpecSpy.calls.reset();
    _updateWorkflowSpecSpy.calls.reset();

    component.selectedSpec = mockWorkflowSpec0;
    const modifiedData: WorkflowSpecDialogData = createClone({circles: true})(mockWorkflowSpec0);
    modifiedData.display_name = 'Modified';
    (component as any)._upsertWorkflowSpecification(modifiedData);
    expect(_addWorkflowSpecSpy).not.toHaveBeenCalled();
    expect(_updateWorkflowSpecSpy).toHaveBeenCalled();
  });

  it('should add a workflow spec', () => {
    const _loadWorkflowSpecsSpy = spyOn((component as any), '_loadWorkflowSpecs').and.stub();
    const _displayMessageSpy = spyOn((component as any), '_displayMessage').and.stub();
    (component as any)._addWorkflowSpec(mockWorkflowSpec0);
    const wfsReq = httpMock.expectOne(`apiRoot/workflow-specification`);
    expect(wfsReq.request.method).toEqual('POST');
    wfsReq.flush(mockWorkflowSpec0);

    expect(_loadWorkflowSpecsSpy).toHaveBeenCalled();
    expect(_displayMessageSpy).toHaveBeenCalled();
  });

  it('should edit a workflow spec', () => {
    const _loadWorkflowSpecsSpy = spyOn((component as any), '_loadWorkflowSpecs').and.stub();
    const _displayMessageSpy = spyOn((component as any), '_displayMessage').and.stub();
    (component as any)._updateWorkflowSpec(mockWorkflowSpec0.id, mockWorkflowSpec0);
    const wfsReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(wfsReq.request.method).toEqual('PUT');
    wfsReq.flush(mockWorkflowSpec0);

    expect(_loadWorkflowSpecsSpy).toHaveBeenCalled();
    expect(_displayMessageSpy).toHaveBeenCalled();
  });

  it('should show a confirmation dialog before deleting a workflow spec', () => {
    const mockConfirmDeleteData: DeleteWorkflowSpecDialogData = {
      confirm: false,
      workflowSpec: mockWorkflowSpec0
    };

    const _deleteWorkflowSpecSpy = spyOn((component as any), '_deleteWorkflowSpec').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockConfirmDeleteData)} as any);

    component.confirmDeleteWorkflowSpec(mockWorkflowSpec0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteWorkflowSpecSpy).not.toHaveBeenCalled();

    mockConfirmDeleteData.confirm = true;
    component.confirmDeleteWorkflowSpec(mockWorkflowSpec0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteWorkflowSpecSpy).toHaveBeenCalled();
  });

  it('should delete a workflow spec', () => {
    const loadWorkflowSpecsSpy = spyOn((component as any), '_loadWorkflowSpecs').and.stub();
    (component as any)._deleteWorkflowSpec(mockWorkflowSpec0);
    const wfsReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(wfsReq.request.method).toEqual('DELETE');
    wfsReq.flush(null);

    expect(loadWorkflowSpecsSpy).toHaveBeenCalled();
  });

  it('should show a metadata dialog when editing a workflow spec category', () => {
    let mockCatData: WorkflowSpecCategoryDialogData = {
      id: null,
      name: '',
      display_name: '',
    };

    const _upsertWorkflowSpecCategorySpy = spyOn((component as any), '_upsertWorkflowSpecCategory')
      .and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockCatData)} as any);

    component.editWorkflowSpecCategory(mockWorkflowSpecCategory0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecCategorySpy).not.toHaveBeenCalled();

    mockCatData = mockWorkflowSpecCategory0 as WorkflowSpecCategoryDialogData;
    component.editWorkflowSpecCategory(mockWorkflowSpecCategory0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecCategorySpy).toHaveBeenCalled();
  });

  it('should edit an existing workflow spec category but add a new workflow spec category', () => {
    const _addWorkflowSpecCategorySpy = spyOn((component as any), '_addWorkflowSpecCategory').and.stub();
    const _updateWorkflowSpecCategorySpy = spyOn((component as any), '_updateWorkflowSpecCategory').and.stub();

    component.selectedCat = undefined;
    (component as any)._upsertWorkflowSpecCategory(mockWorkflowSpecCategory1 as WorkflowSpecCategoryDialogData);
    expect(_addWorkflowSpecCategorySpy).toHaveBeenCalled();
    expect(_updateWorkflowSpecCategorySpy).not.toHaveBeenCalled();

    _addWorkflowSpecCategorySpy.calls.reset();
    _updateWorkflowSpecCategorySpy.calls.reset();

    component.selectedCat = mockWorkflowSpecCategory0;
    const modifiedData: WorkflowSpecCategoryDialogData = createClone({circles: true})(mockWorkflowSpecCategory0);
    modifiedData.display_name = 'Modified';
    (component as any)._upsertWorkflowSpecCategory(modifiedData);
    expect(_addWorkflowSpecCategorySpy).not.toHaveBeenCalled();
    expect(_updateWorkflowSpecCategorySpy).toHaveBeenCalled();
  });

  it('should add a workflow spec', () => {
    const _loadWorkflowSpecCategoriesSpy = spyOn((component as any), '_loadWorkflowSpecCategories').and.stub();
    const _displayMessageSpy = spyOn((component as any), '_displayMessage').and.stub();
    (component as any)._addWorkflowSpecCategory(mockWorkflowSpecCategory0);
    const catReq = httpMock.expectOne(`apiRoot/workflow-specification-category`);
    expect(catReq.request.method).toEqual('POST');
    catReq.flush(mockWorkflowSpecCategory0);

    expect(_loadWorkflowSpecCategoriesSpy).toHaveBeenCalled();
    expect(_displayMessageSpy).toHaveBeenCalled();
  });

  it('should edit a workflow spec category', () => {
    const _loadWorkflowSpecCategoriesSpy = spyOn((component as any), '_loadWorkflowSpecCategories').and.stub();
    const _displayMessageSpy = spyOn((component as any), '_displayMessage').and.stub();
    (component as any)._updateWorkflowSpecCategory(mockWorkflowSpecCategory0.id, mockWorkflowSpecCategory0);
    const catReq = httpMock.expectOne(`apiRoot/workflow-specification-category/${mockWorkflowSpecCategory0.id}`);
    expect(catReq.request.method).toEqual('PUT');
    catReq.flush(mockWorkflowSpecCategory0);

    expect(_loadWorkflowSpecCategoriesSpy).toHaveBeenCalled();
    expect(_displayMessageSpy).toHaveBeenCalled();
  });

  it('should show a confirmation dialog before deleting a workflow spec category', () => {
    const mockConfirmDeleteData: DeleteWorkflowSpecCategoryDialogData = {
      confirm: false,
      category: mockWorkflowSpecCategory0
    };

    const _deleteWorkflowSpecCategorySpy = spyOn((component as any), '_deleteWorkflowSpecCategory').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockConfirmDeleteData)} as any);

    component.confirmDeleteWorkflowSpecCategory(mockWorkflowSpecCategory0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteWorkflowSpecCategorySpy).not.toHaveBeenCalled();

    mockConfirmDeleteData.confirm = true;
    component.confirmDeleteWorkflowSpecCategory(mockWorkflowSpecCategory0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteWorkflowSpecCategorySpy).toHaveBeenCalled();
  });

  it('should delete a workflow spec category', () => {
    const _loadWorkflowSpecCategoriesSpy = spyOn((component as any), '_loadWorkflowSpecCategories').and.stub();
    (component as any)._deleteWorkflowSpecCategory(mockWorkflowSpecCategory0);
    const catReq = httpMock.expectOne(`apiRoot/workflow-specification-category/${mockWorkflowSpecCategory0.id}`);
    expect(catReq.request.method).toEqual('DELETE');
    catReq.flush(null);

    expect(_loadWorkflowSpecCategoriesSpy).toHaveBeenCalled();
  });

});
