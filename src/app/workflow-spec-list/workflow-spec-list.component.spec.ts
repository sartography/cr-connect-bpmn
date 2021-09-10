import {APP_BASE_HREF} from '@angular/common';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatCardModule} from '@angular/material/card';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import { cloneDeep } from 'lodash';
import {of} from 'rxjs';
import {
  ApiErrorsComponent,
  ApiService,
  MockEnvironment,
  mockWorkflowSpec0,
  mockWorkflowSpec1,
  mockWorkflowSpec2,
  mockWorkflowSpecCategories,
  mockWorkflowSpecCategory0,
  mockWorkflowSpecCategory1,
  mockWorkflowSpecCategory2,
  mockWorkflowSpecs,
  WorkflowSpec
} from 'sartography-workflow-lib';
import {ApiError} from 'sartography-workflow-lib/lib/types/api';
import {DeleteWorkflowSpecDialogComponent} from '../_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import {
  DeleteWorkflowSpecCategoryDialogData,
  DeleteWorkflowSpecDialogData,
  WorkflowSpecCategoryDialogData,
  WorkflowSpecDialogData
} from '../_interfaces/dialog-data';
import {GetIconCodePipe} from '../_pipes/get-icon-code.pipe';
import {FileListComponent} from '../file-list/file-list.component';
import {WorkflowSpecListComponent} from './workflow-spec-list.component';


export class MdDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of([
        {}
      ])
    };
  }
}

const librarySpec0: WorkflowSpec = {
  id: 'one_thing',
  name: 'one_thing',
  display_name: 'One thing',
  description: 'Do just one thing',
  category_id: 2,
  library: true,
  category: mockWorkflowSpecCategory2,
  display_order: 2,
};

describe('WorkflowSpecListComponent', () => {
  let httpMock: HttpTestingController;
  let component: WorkflowSpecListComponent;
  let fixture: ComponentFixture<WorkflowSpecListComponent>;
  let dialog: MatDialog;

  beforeEach(waitForAsync(() => {
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
        {provide: APP_BASE_HREF, useValue: ''},
        {
          provide: MatDialogRef, useClass: MdDialogMock,
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
    dialog = TestBed.inject(MatDialog);

    const catReq = httpMock.expectOne('apiRoot/workflow-specification-category');
    expect(catReq.request.method).toEqual('GET');
    catReq.flush(mockWorkflowSpecCategories);
    expect(component.categories.length).toBeGreaterThan(0);

    const specReq2 =  httpMock.expectOne('apiRoot/workflow-specification?libraries=true');
    expect(specReq2.request.method).toEqual('GET');
    specReq2.flush([librarySpec0]);
    fixture.detectChanges();
    expect(component.workflowLibraries.length).toBeGreaterThan(0);

    const specReq =  httpMock.expectOne('apiRoot/workflow-specification');
    expect(specReq.request.method).toEqual('GET');
    specReq.flush(mockWorkflowSpecs);
    fixture.detectChanges();
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
      display_order: 0,
      standalone: false,
      library: false
    };

    const _upsertWorkflowSpecificationSpy = spyOn((component as any), '_upsertWorkflowSpecification')
      .and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockSpecData)} as any);
    component.selectedSpec = mockWorkflowSpec1;
    component.selectedSpec.parents = [];
    component.selectedSpec.libraries = [];
    component.editWorkflowSpec();
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
    (component as any)._upsertWorkflowSpecification(true, mockWorkflowSpec1 as WorkflowSpecDialogData);
    expect(_addWorkflowSpecSpy).toHaveBeenCalled();
    expect(_updateWorkflowSpecSpy).not.toHaveBeenCalled();

    _addWorkflowSpecSpy.calls.reset();
    _updateWorkflowSpecSpy.calls.reset();

    component.selectedSpec = mockWorkflowSpec0;
    const modifiedData: WorkflowSpec = cloneDeep(mockWorkflowSpec0);
    modifiedData.display_name = 'Modified';
    (component as any)._upsertWorkflowSpecification(false, modifiedData);
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

    const wfsReq2 = httpMock.expectOne(`apiRoot/workflow-specification?libraries=true`);
    expect(wfsReq2.request.method).toEqual('GET');
    wfsReq2.flush([librarySpec0]);


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
    const modifiedData: WorkflowSpecCategoryDialogData = cloneDeep(mockWorkflowSpecCategory0);
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

  it('should validate workflow spec', () => {
    const bottomSheetSpy = spyOn((component as any).bottomSheet, 'open').and.stub();
    const snackBarSpy = spyOn((component as any).snackBar, 'open').and.stub();

    component.validateWorkflowSpec(mockWorkflowSpec0);
    const validReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}/validate`);
    expect(validReq.request.method).toEqual('GET');
    validReq.flush(null);
    expect(bottomSheetSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();

    bottomSheetSpy.calls.reset();
    snackBarSpy.calls.reset();

    component.validateWorkflowSpec(mockWorkflowSpec0);
    const invalidReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}/validate`);
    expect(invalidReq.request.method).toEqual('GET');

    const mockError: ApiError = {
      status_code: 42,
      code: 'random_number',
      message: 'Pick a number, any number',
      task_id: 'abc123',
      task_name: 'task_random_num',
      file_name: 'random.bpmn',
      tag: 'bpmn:definitions',
      task_data: {},
      line_number: 12,
      offset: 0,
      error_line: 'x != y'
    };
    invalidReq.flush([mockError]);
    expect(bottomSheetSpy).toHaveBeenCalled();
    expect(snackBarSpy).not.toHaveBeenCalled();

  });

  /**
   *  Deprecated - removed reorder and ability to directly edit display order
   *
  it('should edit category display order', () => {
    // const _reorderSpy = spyOn((component as any), '_reorder').and.stub();
    const _updateCatDisplayOrdersSpy = spyOn((component as any), '_updateCatDisplayOrders').and.stub();

    component.editCategoryDisplayOrder(2, -1, mockWorkflowSpecCategories);
    // expect(_reorderSpy).toHaveBeenCalled();
    expect(_updateCatDisplayOrdersSpy).toHaveBeenCalled();
  });


  it('should edit workflow spec display order', () => {
    // const _reorderSpy = spyOn((component as any), '_reorder').and.stub();
    const _updateSpecDisplayOrdersSpy = spyOn((component as any), '_updateSpecDisplayOrders').and.stub();

    component.editSpecDisplayOrder('few_things', -1, mockWorkflowSpecs);
    // expect(_reorderSpy).toHaveBeenCalled();
    expect(_updateSpecDisplayOrdersSpy).toHaveBeenCalled();
  });


  it('should reorder categories', () => {
    const snackBarSpy = spyOn((component as any).snackBar, 'open').and.stub();
    const moveUpSpy = spyOn(component, 'moveUp').and.callThrough();
    const moveDownSpy = spyOn(component, 'moveDown').and.callThrough();
    const expectedCatsAfter = [mockWorkflowSpecCategory1, mockWorkflowSpecCategory0, mockWorkflowSpecCategory2];

    expect((component as any)._reorder(99, 1, mockWorkflowSpecCategories)).toEqual([]);
    expect(snackBarSpy).toHaveBeenCalled();
    expect(moveUpSpy).not.toHaveBeenCalled();
    expect(moveDownSpy).not.toHaveBeenCalled();

    snackBarSpy.calls.reset();
    moveUpSpy.calls.reset();
    moveDownSpy.calls.reset();
    expect((component as any)._reorder(1, -1, mockWorkflowSpecCategories)).toEqual(expectedCatsAfter);
    expect(snackBarSpy).not.toHaveBeenCalled();
    expect(moveUpSpy).toHaveBeenCalled();
    expect(moveDownSpy).not.toHaveBeenCalled();

    snackBarSpy.calls.reset();
    moveUpSpy.calls.reset();
    moveDownSpy.calls.reset();
    expect((component as any)._reorder(0, 1, mockWorkflowSpecCategories)).toEqual(expectedCatsAfter);
    expect(snackBarSpy).not.toHaveBeenCalled();
    expect(moveUpSpy).not.toHaveBeenCalled();
    expect(moveDownSpy).toHaveBeenCalled();
  });


  it('should reorder specs', () => {
    const snackBarSpy = spyOn((component as any).snackBar, 'open').and.stub();
    const moveUpSpy = spyOn(component, 'moveUp').and.callThrough();
    const moveDownSpy = spyOn(component, 'moveDown').and.callThrough();
    const specsAfter = [
      mockWorkflowSpec1,
      mockWorkflowSpec0,
      mockWorkflowSpec2,
    ];

    expect((component as any)._reorder('nonexistent_id', 1, mockWorkflowSpecs)).toEqual([]);
    expect(snackBarSpy).toHaveBeenCalled();
    expect(moveUpSpy).not.toHaveBeenCalled();
    expect(moveDownSpy).not.toHaveBeenCalled();

    snackBarSpy.calls.reset();
    moveUpSpy.calls.reset();
    moveDownSpy.calls.reset();
    expect((component as any)._reorder(mockWorkflowSpec1.id, -1, mockWorkflowSpecs)).toEqual(specsAfter);
    expect(snackBarSpy).not.toHaveBeenCalled();
    expect(moveUpSpy).toHaveBeenCalled();
    expect(moveDownSpy).not.toHaveBeenCalled();

    snackBarSpy.calls.reset();
    moveUpSpy.calls.reset();
    moveDownSpy.calls.reset();
    expect((component as any)._reorder(mockWorkflowSpec0.id, 1, mockWorkflowSpecs)).toEqual(specsAfter);
    expect(snackBarSpy).not.toHaveBeenCalled();
    expect(moveUpSpy).not.toHaveBeenCalled();
    expect(moveDownSpy).toHaveBeenCalled();
  });
   */

  it('should update all category display orders', () => {
    const editCategoryDisplayOrderSpy = spyOn((component as any), 'editCategoryDisplayOrder').and.stub();

    mockWorkflowSpecCategories.forEach((cat, i) => {
      let results = { param: 'direction', value: 'down' };
      const req = httpMock.expectOne(`apiRoot/workflow-specification-category/${cat.id}/reorder?${results.param}=${results.value}`);
      expect(req.request.method).toEqual('PUT');
      req.flush(mockWorkflowSpecCategories[i]);
    });

    expect(editCategoryDisplayOrderSpy).toHaveBeenCalled();
  });
  /**

  it('should update all spec display orders', () => {
    const _loadWorkflowSpecCategoriesSpy = spyOn((component as any), '_loadWorkflowSpecCategories').and.stub();

    mockWorkflowSpecs.forEach((spec, i) => {
      const req = httpMock.expectOne(`apiRoot/workflow-specification/${spec.id}`);
      expect(req.request.method).toEqual('PUT');
      req.flush(mockWorkflowSpecs[i]);
    });

    expect(_loadWorkflowSpecCategoriesSpy).toHaveBeenCalled();
  });
   */



  it('should load master workflow spec', () => {
    const mockMasterSpec: WorkflowSpec = {
      id: 'master_status_spec',
      name: 'master_status_spec',
      display_name: 'master_status_spec',
      description: 'master_status_spec',
      is_master_spec: true,
      display_order: null,
      category_id: null,
    };
    (component as any)._loadWorkflowSpecs();
    const allSpecs = cloneDeep(mockWorkflowSpecs);
    allSpecs.push(mockMasterSpec);

    const req = httpMock.expectOne(`apiRoot/workflow-specification`);
    expect(req.request.method).toEqual('GET');
    req.flush(allSpecs);

    expect(component.workflowSpecs).toEqual(allSpecs);
    expect(component.workflowSpecsByCategory).toBeTruthy();
    component.workflowSpecsByCategory.forEach(cat => {
      expect(cat.workflow_specs).not.toContain(mockMasterSpec);
    });
    expect(component.masterStatusSpec).toEqual(mockMasterSpec);
  });


  it('should call editWorkflowSpec, open Dialog & call _upsertWorkflowSpecification when Edit button is clicked', fakeAsync(() => {
      spyOn(dialog, 'open').and.callThrough();
      const button = fixture.debugElement.nativeElement.querySelector('#add_spec');
      button.click();
      httpMock.expectOne(`apiRoot/workflow-specification-category`);
      expect(dialog.open).toHaveBeenCalled();
    }
  ));

  it('should disallow deselecting library if being used as library', () => {
    let mockSpecData: WorkflowSpecDialogData = {
      id: '25',
      name: 'name1',
      display_name: 'displayname',
      description: 'descr',
      category_id: 0,
      display_order: 0,
      standalone: false,
      library: false
    };

    const _upsertWorkflowSpecificationSpy = spyOn((component as any), '_upsertWorkflowSpecification')
      .and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockSpecData)} as any);
    const canSaveSpy = spyOn(component, 'canSaveWorkflowSpec').and.callThrough();
    const snackBarSpy = spyOn((component as any).snackBar, 'open').and.stub();
    const localSelectedSpec = cloneDeep(mockWorkflowSpec0);
    localSelectedSpec.parents = [
      { id: 1234,
        display_name: 'test parent',
        name: 'parent1'
      }]
    component.selectedSpec = localSelectedSpec;
    component.editWorkflowSpec(localSelectedSpec);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecificationSpy).not.toHaveBeenCalled();
    expect(canSaveSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('should disallow saving as both library and standalone', () => {
    // we need to have id,name and display_name filled out because there is a conditional
    // that fails prior to saving if any of these are blank
    let mockSpecData: WorkflowSpecDialogData = {
      id: '25',
      name: 'name1',
      display_name: 'displayname',
      description: 'descr',
      category_id: 0,
      display_order: 0,
      standalone: true,
      library: true
    };

    const _upsertWorkflowSpecificationSpy = spyOn((component as any), '_upsertWorkflowSpecification')
      .and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockSpecData)} as any);
    const canSaveSpy = spyOn(component, 'canSaveWorkflowSpec').and.callThrough();
    const snackBarSpy = spyOn((component as any).snackBar, 'open').and.stub();
    const localSelectedSpec = cloneDeep(mockWorkflowSpec0);
    localSelectedSpec.parents = [
      { id: 1234,
        display_name: 'test parent',
        name: 'parent1'
      }]
    component.selectedSpec = localSelectedSpec;
    component.editWorkflowSpec(localSelectedSpec);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecificationSpy).not.toHaveBeenCalled();
    expect(canSaveSpy).toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });

  it('should not delete a library if it is being used', () => {

    const badWorkflowSpec = cloneDeep(mockWorkflowSpec0);
    badWorkflowSpec.parents=[
      { id: 1234,
        display_name: 'test parent',
        name: 'parent1'
      }]
    badWorkflowSpec.library=true;
    const mockConfirmDeleteData: DeleteWorkflowSpecDialogData = {
      confirm: false,
      workflowSpec: badWorkflowSpec
    };

    const _deleteWorkflowSpecSpy = spyOn((component as any), '_deleteWorkflowSpec').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockConfirmDeleteData)} as any);
    const snackBarSpy = spyOn((component as any).snackBar, 'open').and.stub();
    mockConfirmDeleteData.confirm = true;
    component.confirmDeleteWorkflowSpec(badWorkflowSpec);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteWorkflowSpecSpy).not.toHaveBeenCalled();
    expect(snackBarSpy).toHaveBeenCalled();
  });


});
