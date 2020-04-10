import {Component, OnInit} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import createClone from 'rfdc';
import {
  ApiService,
  isNumberDefined,
  moveArrayElementDown,
  moveArrayElementUp,
  WorkflowSpec,
  WorkflowSpecCategory
} from 'sartography-workflow-lib';
import {DeleteWorkflowSpecCategoryDialogComponent} from '../_dialogs/delete-workflow-spec-category-dialog/delete-workflow-spec-category-dialog.component';
import {DeleteWorkflowSpecDialogComponent} from '../_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import {WorkflowSpecCategoryDialogComponent} from '../_dialogs/workflow-spec-category-dialog/workflow-spec-category-dialog.component';
import {WorkflowSpecDialogComponent} from '../_dialogs/workflow-spec-dialog/workflow-spec-dialog.component';
import {
  DeleteWorkflowSpecCategoryDialogData,
  DeleteWorkflowSpecDialogData,
  WorkflowSpecCategoryDialogData,
  WorkflowSpecDialogData
} from '../_interfaces/dialog-data';
import {ApiErrorsComponent} from '../api-errors/api-errors.component';


interface WorkflowSpecCategoryGroup {
  id: number;
  name: string;
  display_name: string;
  workflow_specs?: WorkflowSpec[];
  display_order: number;
}

@Component({
  selector: 'app-workflow-spec-list',
  templateUrl: './workflow-spec-list.component.html',
  styleUrls: ['./workflow-spec-list.component.scss']
})
export class WorkflowSpecListComponent implements OnInit {
  workflowSpecs: WorkflowSpec[] = [];
  selectedSpec: WorkflowSpec;
  masterStatusSpec: WorkflowSpec;
  selectedCat: WorkflowSpecCategory;
  workflowSpecsByCategory: WorkflowSpecCategoryGroup[] = [];
  categories: WorkflowSpecCategory[];

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    public dialog: MatDialog
  ) {
    this._loadWorkflowSpecCategories();
  }

  ngOnInit() {
  }

  validateWorkflowSpec(wfs: WorkflowSpec) {
    this.api.validateWorkflowSpecification(wfs.id).subscribe(apiErrors => {
      if (apiErrors && apiErrors.length > 0) {
        this.bottomSheet.open(ApiErrorsComponent, {data: {apiErrors: apiErrors}});
      } else {
        this.snackBar.open('Workflow specification is valid!', 'Ok', {duration: 5000});
      }
    });
  }

  editWorkflowSpec(selectedSpec?: WorkflowSpec) {
    this.selectedSpec = selectedSpec;
    const hasDisplayOrder = this.selectedSpec && isNumberDefined(this.selectedSpec.display_order);
    const dialogData: WorkflowSpecDialogData = {
      id: this.selectedSpec ? this.selectedSpec.id : '',
      name: this.selectedSpec ? this.selectedSpec.name || this.selectedSpec.id : '',
      display_name: this.selectedSpec ? this.selectedSpec.display_name : '',
      description: this.selectedSpec ? this.selectedSpec.description : '',
      category_id: this.selectedSpec ? this.selectedSpec.category_id : null,
      display_order: hasDisplayOrder ? this.selectedSpec.display_order : 0,
    };

    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(WorkflowSpecDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: WorkflowSpecDialogData) => {
      if (data && data.id && data.name && data.display_name && data.description) {
        this._upsertWorkflowSpecification(data);
      }
    });
  }

  editWorkflowSpecCategory(selectedCat?: WorkflowSpecCategoryGroup) {
    this.selectedCat = selectedCat;

    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(WorkflowSpecCategoryDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: {
        id: this.selectedCat ? this.selectedCat.id : null,
        name: this.selectedCat ? this.selectedCat.name || this.selectedCat.id : '',
        display_name: this.selectedCat ? this.selectedCat.display_name : '',
        display_order: this.selectedCat ? this.selectedCat.display_order : null,
      },
    });

    dialogRef.afterClosed().subscribe((data: WorkflowSpecCategoryDialogData) => {
      if (data && isNumberDefined(data.id) && data.name && data.display_name) {
        this._upsertWorkflowSpecCategory(data);
      }
    });
  }

  confirmDeleteWorkflowSpecCategory(cat: WorkflowSpecCategory) {
    const dialogRef = this.dialog.open(DeleteWorkflowSpecCategoryDialogComponent, {
      data: {
        confirm: false,
        category: cat,
      }
    });

    dialogRef.afterClosed().subscribe((data: DeleteWorkflowSpecCategoryDialogData) => {
      if (data && data.confirm && data.category) {
        this._deleteWorkflowSpecCategory(data.category);
      }
    });
  }

  confirmDeleteWorkflowSpec(wfs: WorkflowSpec) {
    const dialogRef = this.dialog.open(DeleteWorkflowSpecDialogComponent, {
      data: {
        confirm: false,
        workflowSpec: wfs,
      }
    });

    dialogRef.afterClosed().subscribe((data: DeleteWorkflowSpecDialogData) => {
      if (data && data.confirm && data.workflowSpec) {
        this._deleteWorkflowSpec(data.workflowSpec);
      }
    });
  }

  onWorkflowUpdated(spec: WorkflowSpec) {
    if (spec.is_master_spec) {
      // Mark all other specs as not is_master_spec
      let numUpdated = this.workflowSpecs.length - 1;
      this.workflowSpecs.forEach(wfs => {
        if (wfs.id !== spec.id) {
          wfs.is_master_spec = false;
          this.api.updateWorkflowSpecification(wfs.id, wfs).subscribe(() => {
            numUpdated--;
            if (numUpdated === 0) {
              this._loadWorkflowSpecCategories();
            }
          });
        }
      });
    }
    this._loadWorkflowSpecCategories();
  }

  editCategoryDisplayOrder(catId: number, direction: number, cats: WorkflowSpecCategoryGroup[]) {
    // Remove the fake category with category-less specs
    const realCats = cats.filter(cat => isNumberDefined(cat.id));
    const i = realCats.findIndex(spec => spec.id === catId);
    if (i !== -1) {
      if (direction === 1) {
        moveArrayElementDown(realCats, i);
      } else if (direction === -1) {
        moveArrayElementUp(realCats, i);
      }
    } else {
      this.snackBar.open('Category not found. Reload the page and try again.');
      return;
    }

    let numUpdated = 0;
    realCats.forEach((cat, j) => {
      if (isNumberDefined(cat.id)) {
        const newCat: WorkflowSpecCategoryGroup = createClone()(cat);
        delete newCat.workflow_specs;

        newCat.display_order = j;
        this.api.updateWorkflowSpecCategory(cat.id, newCat as WorkflowSpecCategory).subscribe(() => {
          numUpdated++;
          if (numUpdated === realCats.length) {
            this._loadWorkflowSpecCategories();
          }
        });
      }
    });
  }

  editSpecDisplayOrder(specId: string, direction: number, specs: WorkflowSpec[]) {
    const i = specs.findIndex(spec => spec.id === specId);
    if (i !== -1) {
      if (direction === 1) {
        moveArrayElementDown(specs, i);
      } else if (direction === -1) {
        moveArrayElementUp(specs, i);
      }
    } else {
      this.snackBar.open('Spec not found. Reload the page and try again.');
      return;
    }

    let numUpdated = 0;
    specs.forEach((spec, j) => {
      spec.display_order = j;
      this.api.updateWorkflowSpecification(spec.id, spec).subscribe(() => {
        numUpdated++;
        if (numUpdated === specs.length) {
          this._loadWorkflowSpecCategories();
        }
      });
    });
  }

  sortByDisplayOrder = (a, b) => (a.display_order < b.display_order) ? -1 : 1;

  private _loadWorkflowSpecCategories() {
    this.api.getWorkflowSpecCategoryList().subscribe(cats => {
      this.categories = cats.sort(this.sortByDisplayOrder);

      // Add a container for specs without a category
      this.workflowSpecsByCategory = [{
        id: null,
        name: 'none',
        display_name: 'No category',
        workflow_specs: [],
        display_order: -1, // Display it at the top
      }];

      this.categories.forEach((cat, i) => {
        this.workflowSpecsByCategory.push(cat);
        this.workflowSpecsByCategory[i + 1].workflow_specs = [];
      });

      this._loadWorkflowSpecs();
    });
  }

  private _loadWorkflowSpecs() {
    this.api.getWorkflowSpecList().subscribe(wfs => {
      this.workflowSpecs = wfs;
      this.workflowSpecsByCategory.forEach(cat => {
        cat.workflow_specs = this.workflowSpecs
          .filter(wf => {
            if (wf.is_master_spec) {
              this.masterStatusSpec = wf;
            } else {
              return wf.category_id === cat.id;
            }
          })
          .sort(this.sortByDisplayOrder);
      });
    });
  }

  private _upsertWorkflowSpecification(data: WorkflowSpecDialogData) {
    if (data.id && data.name && data.display_name && data.description) {

      // Save old workflow spec id, in case it's changed
      const specId = this.selectedSpec ? this.selectedSpec.id : undefined;

      const newSpec: WorkflowSpec = {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        description: data.description,
        category_id: data.category_id,
        display_order: data.display_order,
      };

      if (specId) {
        this._updateWorkflowSpec(specId, newSpec);
      } else {
        this._addWorkflowSpec(newSpec);
      }
    }
  }

  private _upsertWorkflowSpecCategory(data: WorkflowSpecCategoryDialogData) {
    if (isNumberDefined(data.id) && data.name && data.display_name) {

      // Save old workflow spec id, in case it's changed
      const catId = this.selectedCat ? this.selectedCat.id : undefined;

      const newCat: WorkflowSpecCategory = {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
        display_order: data.display_order,
      };

      if (isNumberDefined(catId)) {
        this._updateWorkflowSpecCategory(catId, newCat);
      } else {
        this._addWorkflowSpecCategory(newCat);
      }
    }
  }

  private _updateWorkflowSpec(specId: string, newSpec: WorkflowSpec) {
    this.api.updateWorkflowSpecification(specId, newSpec).subscribe(_ => {
      this._loadWorkflowSpecs();
      this._displayMessage('Saved changes to workflow spec.');
    });
  }

  private _addWorkflowSpec(newSpec: WorkflowSpec) {
    this.api.addWorkflowSpecification(newSpec).subscribe(_ => {
      this._loadWorkflowSpecs();
      this._displayMessage('Saved new workflow spec.');
    });
  }

  private _deleteWorkflowSpec(workflowSpec: WorkflowSpec) {
    this.api.deleteWorkflowSpecification(workflowSpec.id).subscribe(() => {
      this._loadWorkflowSpecs();
      this._displayMessage(`Deleted workflow spec ${workflowSpec.name}.`);
    });
  }

  private _updateWorkflowSpecCategory(catId: number, newCat: WorkflowSpecCategory) {
    this.api.updateWorkflowSpecCategory(catId, newCat).subscribe(_ => {
      this._loadWorkflowSpecCategories();
      this._displayMessage('Saved changes to workflow spec category.');
    });
  }

  private _addWorkflowSpecCategory(newCat: WorkflowSpecCategory) {
    this.api.addWorkflowSpecCategory(newCat).subscribe(_ => {
      this._loadWorkflowSpecCategories();
      this._displayMessage('Saved new workflow spec category.');
    });
  }

  private _deleteWorkflowSpecCategory(workflowSpecCategory: WorkflowSpecCategory) {
    this.api.deleteWorkflowSpecCategory(workflowSpecCategory.id).subscribe(() => {
      this._loadWorkflowSpecCategories();
      this._displayMessage(`Deleted workflow spec category ${workflowSpecCategory.name}.`);
    });
  }

  private _displayMessage(message: string) {
    this.snackBar.open(message, 'Ok', {duration: 3000});
  }
}

