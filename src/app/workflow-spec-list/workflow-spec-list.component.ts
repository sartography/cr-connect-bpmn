import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService, WorkflowSpec, WorkflowSpecCategory} from 'sartography-workflow-lib';
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

interface WorklflowSpecCategoryGroup {
  id: number;
  name: string;
  display_name: string;
  workflow_specs?: WorkflowSpec[];
}

@Component({
  selector: 'app-workflow-spec-list',
  templateUrl: './workflow-spec-list.component.html',
  styleUrls: ['./workflow-spec-list.component.scss']
})
export class WorkflowSpecListComponent implements OnInit {
  workflowSpecs: WorkflowSpec[] = [];
  selectedSpec: WorkflowSpec;
  selectedCat: WorkflowSpecCategory;
  workflowSpecsByCategory: WorklflowSpecCategoryGroup[] = [];
  categories: WorkflowSpecCategory[];

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this._loadWorkflowSpecCategories();
  }

  ngOnInit() {
  }

  editWorkflowSpec(selectedSpec?: WorkflowSpec) {
    this.selectedSpec = selectedSpec;

    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(WorkflowSpecDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: {
        id: this.selectedSpec ? this.selectedSpec.id : '',
        name: this.selectedSpec ? this.selectedSpec.name || this.selectedSpec.id : '',
        display_name: this.selectedSpec ? this.selectedSpec.display_name : '',
        description: this.selectedSpec ? this.selectedSpec.description : '',
        workflow_spec_category_id: this.selectedSpec ? this.selectedSpec.workflow_spec_category_id : '',
      },
    });

    dialogRef.afterClosed().subscribe((data: WorkflowSpecDialogData) => {
      if (data && data.id && data.name && data.display_name && data.description) {
        this._upsertWorkflowSpecification(data);
      }
    });
  }

  editWorkflowSpecCategory(selectedCat?: WorkflowSpecCategory) {
    this.selectedCat = selectedCat;

    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(WorkflowSpecCategoryDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: {
        id: this.selectedCat ? this.selectedCat.id : '',
        name: this.selectedCat ? this.selectedCat.name || this.selectedCat.id : '',
        display_name: this.selectedCat ? this.selectedCat.display_name : '',
      },
    });

    dialogRef.afterClosed().subscribe((data: WorkflowSpecCategoryDialogData) => {
      if (data && data.id && data.name && data.display_name) {
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

  private _loadWorkflowSpecCategories() {
    this.api.getWorkflowSpecCategoryList().subscribe(cats => {
      this.categories = cats;
      this.workflowSpecsByCategory = [{
        id: null,
        name: 'none',
        display_name: 'No category',
        workflow_specs: [],
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
        cat.workflow_specs = this.workflowSpecs.filter(wf => wf.workflow_spec_category_id === cat.id);
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
        workflow_spec_category_id: data.workflow_spec_category_id,
      };

      if (specId) {
        this._updateWorkflowSpec(specId, newSpec);
      } else {
        this._addWorkflowSpec(newSpec);
      }
    }
  }

  private _upsertWorkflowSpecCategory(data: WorkflowSpecCategoryDialogData) {
    if (data.id && data.name && data.display_name) {

      // Save old workflow spec id, in case it's changed
      const catId = this.selectedCat ? this.selectedCat.id : undefined;

      const newCat: WorkflowSpecCategory = {
        id: data.id,
        name: data.name,
        display_name: data.display_name,
      };

      if (catId) {
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

