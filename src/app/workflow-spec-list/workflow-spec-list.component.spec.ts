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
  MockEnvironment, mockWorkflowMeta1,
  mockWorkflowSpec0,
  mockWorkflowSpec1,
  mockWorkflowSpec2, mockWorkflowSpec3,
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
import {WorkflowSpecCategoryGroup, WorkflowSpecListComponent} from './workflow-spec-list.component';
import {GitRepoDialogComponent} from "../git-repo-dialog/git-repo-dialog.component";


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
  display_name: 'One thing',
  description: 'Do just one thing',
  category_id: '2',
  library: true,
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

    const gitReq = httpMock.expectOne('apiRoot/git_repo');
    expect(gitReq.request.method).toEqual('GET');
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
      display_name: '',
      description: '',
      category_id: '0',
      display_order: 0,
      standalone: false,
      library: false,
      libraries: [],
      is_master_spec: false,
      primary_file_name: '',
      primary_process_id: ''
    };

    const _upsertWorkflowSpecificationSpy = spyOn((component as any), '_upsertWorkflowSpecification')
      .and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockSpecData)} as any);
    component.selectedSpec = mockWorkflowSpec1;
    component.selectedSpec.libraries = [];
    component.editWorkflowSpec('study');
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecificationSpy).not.toHaveBeenCalled();

    mockSpecData = mockWorkflowSpec0 as WorkflowSpecDialogData;
    component.editWorkflowSpec('study', mockWorkflowSpec0);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_upsertWorkflowSpecificationSpy).toHaveBeenCalled();
  });

  it('should either edit a workflow spec, OR add a new workflow spec', () => {
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
    const _loadWorkflowLibrariesSpy = spyOn((component as any), '_loadWorkflowLibraries').and.stub();
    const _displayMessageSpy = spyOn((component as any), '_displayMessage').and.stub();
    (component as any)._addWorkflowSpec(mockWorkflowSpec0);
    const wfsReq = httpMock.expectOne(`apiRoot/workflow-specification`);
    expect(wfsReq.request.method).toEqual('POST');
    wfsReq.flush(mockWorkflowSpec0);

    expect(_loadWorkflowSpecsSpy).toHaveBeenCalled();
    expect(_loadWorkflowLibrariesSpy).toHaveBeenCalled();
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
    const _loadWorkflowLibrariesSpy = spyOn((component as any), '_loadWorkflowLibraries').and.stub();
    (component as any)._deleteWorkflowSpec(mockWorkflowSpec0);
    const wfsReq = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec0.id}`);
    expect(wfsReq.request.method).toEqual('DELETE');
    wfsReq.flush(null);

    expect(loadWorkflowSpecsSpy).toHaveBeenCalled();
    expect(_loadWorkflowLibrariesSpy).toHaveBeenCalled();
  });

  it('should set a library spec as the selected spec', () => {
    const _loadWorkflowLibrariesSpy = spyOn((component as any), '_loadWorkflowLibraries').and.stub();
    (component as any)._loadWorkflowLibraries(mockWorkflowSpec3)
    component.selectedSpec = mockWorkflowSpec3;
    expect(_loadWorkflowLibrariesSpy).toHaveBeenCalled()
    expect(component.selectedSpec).toEqual(mockWorkflowSpec3)
  })

  it('should show a metadata dialog when editing a workflow spec category', () => {
    let mockCatData: WorkflowSpecCategoryDialogData = {
      id: null,
      display_name: '',
      admin: null,
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

  it('should edit an existing workflow spec category OR add a new workflow spec category', () => {
    const _addWorkflowSpecCategorySpy = spyOn((component as any), '_addWorkflowSpecCategory').and.stub();
    const _updateWorkflowSpecCategorySpy = spyOn((component as any), '_updateWorkflowSpecCategory').and.stub();

    // This disaster keeps up from having to deal with the '"find" is not a function' error, it assures there is one.
    if (typeof Array.prototype.find !== 'function') {
      Array.prototype.find = function(iterator) {
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (iterator.call(thisArg, value, i, list)) {
            return value;
          }
        }
        return undefined;
      };
    }

    component.selectedCat = undefined;
    mockWorkflowSpecCategory1.id = null;
    (component as any)._upsertWorkflowSpecCategory(mockWorkflowSpecCategory1 as WorkflowSpecCategoryDialogData);

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

  it('should update a single category display order', () => {
    mockWorkflowSpecCategory1.id = '5';

    // Intermittently, Jasmine does not find the array prototype function, causing errors.
    // This defines the 'find' function in case it doesn't find it.
    if (typeof Array.prototype.find !== 'function') {
        Array.prototype.find = function(iterator) {
            let list = Object(this);
            let length = list.length >>> 0;
            let thisArg = arguments[1];
            let value;

            for (let i = 0; i < length; i++) {
                value = list[i];
                if (iterator.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }
    (component as any).editCategoryDisplayOrder(mockWorkflowSpecCategory1.id, 'down');
    let results = { param: 'direction', value: 'down' };
    const req = httpMock.expectOne(`apiRoot/workflow-specification-category/${mockWorkflowSpecCategory1.id}/reorder?${results.param}=${results.value}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockWorkflowSpecCategory1);
  });

  it('should update a single spec display order', () => {
    let wfs_group: WorkflowSpecCategoryGroup[] = [];
    mockWorkflowSpecCategory1.workflows.push(mockWorkflowMeta1);
    wfs_group.push(mockWorkflowSpecCategory1);
    (component as any).editSpecDisplayOrder(wfs_group[0], mockWorkflowSpec1.id, 'down');
    let results = { param: 'direction', value: 'down' };
    const req = httpMock.expectOne(`apiRoot/workflow-specification/${mockWorkflowSpec1.id}/reorder?${results.param}=${results.value}`);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockWorkflowSpecCategory1);
  });


  it('should load master workflow spec', () => {
    const mockMasterSpec: WorkflowSpec = {
      id: 'master_status_spec',
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

  it('should not delete a library if it is being used', () => {

    const badWorkflowSpec = cloneDeep(mockWorkflowSpec0);
    mockWorkflowSpec1.libraries = ['all_things']
    badWorkflowSpec.library=true;
    const mockConfirmDeleteData: DeleteWorkflowSpecDialogData = {
      confirm: false,
      workflowSpec: badWorkflowSpec
    };

    const _deleteWorkflowSpecSpy = spyOn((component as any), '_deleteWorkflowSpec').and.stub();
    const openDialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of(mockConfirmDeleteData)} as any);
    mockConfirmDeleteData.confirm = true;
    component.confirmDeleteWorkflowSpec(badWorkflowSpec);
    expect(openDialogSpy).toHaveBeenCalled();
    expect(_deleteWorkflowSpecSpy).not.toHaveBeenCalled();
  });

    it('should call gitPush', () => {
    const mockComment = 'my comment';
    const gitPushSpy = spyOn((component as any), 'gitPush').and.stub();
    const dialogSpy = spyOn(component.dialog, 'open')
      .and.returnValue({afterClosed: () => of (mockComment)} as any);

    component.gitPush();
    expect(gitPushSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalled();
  });


});
