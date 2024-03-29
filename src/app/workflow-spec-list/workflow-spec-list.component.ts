import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cloneDeep } from 'lodash';
import {
  ApiErrorsComponent,
  ApiService,
  // moveArrayElementDown,
  // moveArrayElementUp,
  WorkflowSpec,
  WorkflowSpecCategory,
} from 'sartography-workflow-lib';
import {
  DeleteWorkflowSpecCategoryDialogComponent
} from '../_dialogs/delete-workflow-spec-category-dialog/delete-workflow-spec-category-dialog.component';
import { DeleteWorkflowSpecDialogComponent } from '../_dialogs/delete-workflow-spec-dialog/delete-workflow-spec-dialog.component';
import { WorkflowSpecCategoryDialogComponent } from '../_dialogs/workflow-spec-category-dialog/workflow-spec-category-dialog.component';
import { WorkflowSpecDialogComponent } from '../_dialogs/workflow-spec-dialog/workflow-spec-dialog.component';
import {
  DeleteWorkflowSpecCategoryDialogData,
  DeleteWorkflowSpecDialogData,
  WorkflowSpecCategoryDialogData,
  WorkflowSpecDialogData,
} from '../_interfaces/dialog-data';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../environments/environment.runtime';
import { UntypedFormControl } from '@angular/forms';
import { SettingsService } from '../settings.service';
 import { MatButtonModule } from '@angular/material/button';
import {GitRepoDialogComponent} from "../git-repo-dialog/git-repo-dialog.component";
import {GitRepo} from "sartography-workflow-lib/lib/types/git";
import {GitMergeDialogComponent} from "../git-merge-dialog/git-merge-dialog.component";


export interface WorkflowSpecCategoryGroup {
  id?: string;
  display_name: string;
  workflow_specs?: WorkflowSpec[];
  display_order?: number;
  admin: boolean,
}

@Component({
  selector: 'app-workflow-spec-list',
  templateUrl: './workflow-spec-list.component.html',
  styleUrls: ['./workflow-spec-list.component.scss'],
})
export class WorkflowSpecListComponent implements OnInit {
  workflowSpecs: WorkflowSpec[] = [];
  workflowLibraries: WorkflowSpec[] = [];
  selectedSpec: WorkflowSpec;
  selectedCatID: string;
  masterStatusSpec: WorkflowSpec;
  selectedCat: WorkflowSpecCategory;
  workflowSpecsByCategory: WorkflowSpecCategoryGroup[] = [];
  categories: WorkflowSpecCategory[];
  searchField: UntypedFormControl;
  library_toggle: boolean;
  gitRepo: GitRepo;

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private location: Location,
    private settingsService: SettingsService,
  ) {
  }

  ngOnInit() {
    this.api.gitRepo().subscribe(gitRepo => {
      this.gitRepo = gitRepo;
    });

    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('spec')) {
        this._loadWorkflowSpecCategories(paramMap.get('spec'));
      } else {
        this._loadWorkflowSpecCategories();
      }
    });

    this.searchField = new UntypedFormControl();
    this.searchField.valueChanges.subscribe(value => {
      this._loadWorkflowSpecs(null, value);
    });
  }

  validateWorkflowSpec(wfs: WorkflowSpec) {
    const studyId = this.settingsService.getStudyIdForValidation();
    this.api.validateWorkflowSpecification(wfs.id, '', studyId).subscribe(apiErrors => {
      if (apiErrors && apiErrors.length > 0) {
        this.bottomSheet.open(ApiErrorsComponent, {data: {apiErrors}});
      } else {
        this.snackBar.open('Workflow specification is valid!', 'Ok', {duration: 5000});
      }
    });
  }

  selectCat(selectedCat?: WorkflowSpecCategoryGroup) {
    this.selectedCat = selectedCat;
  }

  setCatByID(cat_id: string) {
    if (cat_id != '') {
      this.api.getWorkflowSpecCategory(cat_id).subscribe(cat => {
        this.selectedCat = cat;
      });
    }
  }

  isSelected(cat: WorkflowSpecCategoryGroup) {
    return this.selectedCat && this.selectedCat.id === cat.id;
  }

  libraryToggle(t: boolean) {
    this.library_toggle = t;
  }

  selectSpec(selectedSpec?: WorkflowSpec) {
    this.selectedSpec = selectedSpec;
    this.location.replaceState(environment.homeRoute + '/' + selectedSpec.id);
  }

  editWorkflowSpec(state: String, selectedSpec?: WorkflowSpec) {

    const hasDisplayOrder = selectedSpec && selectedSpec.display_order;
    const dialogData: WorkflowSpecDialogData = {
      id: selectedSpec ? selectedSpec.id : '',
      display_name: selectedSpec ? selectedSpec.display_name : '',
      description: selectedSpec ? selectedSpec.description : '',
      category_id: selectedSpec ? selectedSpec.category_id : null,
      display_order: hasDisplayOrder ? selectedSpec.display_order : 0,
      standalone: selectedSpec ? selectedSpec.standalone : null,
      library: selectedSpec ? selectedSpec.library : (state === 'library' ? true : null),
      libraries: selectedSpec ? selectedSpec.libraries : [],
      primary_file_name: selectedSpec ? selectedSpec.primary_file_name : '',
      primary_process_id: selectedSpec ? selectedSpec.primary_process_id : '',
      is_master_spec: false,
    };

    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(WorkflowSpecDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((data: WorkflowSpecDialogData) => {
        if (data && data.id && data.display_name && data.description) {
          data.id = this.toLowercaseId(data.id);
          this._upsertWorkflowSpecification(selectedSpec == null, data);
        }
    });
  }

  // Helper function to convert strings to valid ID's.
  toLowercaseId(id: String) {
    return id.replace(/ /g,"_").toLowerCase();
  }

  editWorkflowSpecCategory(selectedCat?: WorkflowSpecCategoryGroup) {
    this.selectedCat = selectedCat;

    // Open new filename/workflow spec dialog
    const dialogRef = this.dialog.open(WorkflowSpecCategoryDialogComponent, {
      height: '65vh',
      width: '50vw',
      data: {
        id: this.selectedCat ? this.selectedCat.id : null,
        display_name: this.selectedCat ? this.selectedCat.display_name : '',
        display_order: this.selectedCat ? this.selectedCat.display_order : null,
        admin: this.selectedCat ? this.selectedCat.admin : null,
      },
    });
    dialogRef.afterClosed().subscribe((data: WorkflowSpecCategoryDialogData) => {
      if (data && data.display_name) {
        console.log('here!')
        this._upsertWorkflowSpecCategory(data);
      }
    });
  }

  confirmDeleteWorkflowSpecCategory(cat: WorkflowSpecCategoryGroup) {
    const dialogRef = this.dialog.open(DeleteWorkflowSpecCategoryDialogComponent, {
      data: {
        confirm: false,
        category: cat,
      },
    });

    dialogRef.afterClosed().subscribe((data: DeleteWorkflowSpecCategoryDialogData) => {
      if (data && data.confirm && data.category) {
        this._deleteWorkflowSpecCategory(data.category);
      }
    });
  }


  canDeleteWorkflowSpec(wfs){
    let references = []
    if (wfs.library){
      this.workflowSpecs.forEach(spec => {
        if (spec.libraries.indexOf(wfs.id) >= 0 ) {
          references.push(spec.id);
        }
      });
      if (references.length > 0) {
        let message = '';
        references.forEach(ref => {
          message += ref.toString() + ', ';
        });
        message = message.substr(0, message.length-2);
        this.snackBar.open('The Library ' + '\'' + wfs.display_name + '\'' +
          ' is still being referenced by these workflows: ' + message, 'Ok');
        return false;
      }
    }
    return true;
  }


  confirmDeleteWorkflowSpec(wfs: WorkflowSpec) {
    const dialogRef = this.dialog.open(DeleteWorkflowSpecDialogComponent, {
      data: {
        confirm: false,
        workflowSpec: wfs,
      },
    });

    dialogRef.afterClosed().subscribe((data: DeleteWorkflowSpecDialogData) => {
      if (data && data.confirm && data.workflowSpec && this.canDeleteWorkflowSpec(data.workflowSpec)) {
        this._deleteWorkflowSpec(data.workflowSpec);
        if (typeof this.masterStatusSpec !== 'undefined') {
          this.selectSpec(this.masterStatusSpec);
        }
      }
    });
  }

  editCategoryDisplayOrder(catId: string, direction: string) {
    this.api.reorderWorkflowCategory(catId, direction).subscribe(cat_change => {
        this.workflowSpecsByCategory = this.workflowSpecsByCategory.map(cat => {
          if (typeof cat_change.find == 'function') {
            let new_cat = cat_change.find(i2 => i2.id === cat.id);
            cat.display_order = new_cat.display_order;
            return cat;
          } else {
            return cat;
          }
        });
        this.workflowSpecsByCategory.sort((x,y) => x.display_order - y.display_order);
    });
  }


  editSpecDisplayOrder(cat: WorkflowSpecCategoryGroup, specId: string, direction: string) {
    this.api.reorderWorkflowSpecification(specId, direction).subscribe(wfs => {
      cat.workflow_specs= wfs;
    });
  }

  private _loadWorkflowSpecCategories(selectedSpecName: string = null) {
    this.api.getWorkflowSpecCategoryList().subscribe(cats => {
      this.categories = cats;
      // Clear out this object before re-filling it
      this.workflowSpecsByCategory = [];

      this.categories.forEach((cat, i) => {
        this.workflowSpecsByCategory.push(cat);
        this.workflowSpecsByCategory[i].workflow_specs = [];
      });
      this._loadWorkflowSpecs(selectedSpecName);
      this._loadWorkflowLibraries(selectedSpecName);
    });
  }

  private _loadWorkflowLibraries(selectedSpecName: string = null) {
    this.api.getWorkflowSpecificationLibraries().subscribe(wfs => {
      this.workflowLibraries = wfs;
      // Sort libraries alphabetically
      this.workflowLibraries.sort((a,b) => a.display_name.localeCompare(b.display_name));

      // If selected spec is a library, set it.
      if (selectedSpecName) {
        wfs.forEach(ws => {
          if (selectedSpecName && selectedSpecName === ws.id) {
            this.selectedSpec = ws;
            this.library_toggle = true;
          }
        });
      } else {
        this.selectedSpec = this.masterStatusSpec;
      }
    });
  }

  private _loadWorkflowSpecs(selectedSpecName: string = null, searchSpecName: string = null) {
    this.api.getWorkflowSpecList().subscribe(wfs => {
      this.workflowSpecs = wfs;
      // Populate categories with their specs
      this.workflowSpecsByCategory.forEach(cat => {
        cat.workflow_specs = this.workflowSpecs
          .filter(wf => {
            // TODO: fix search feature
            if (searchSpecName) {
              return (wf.category_id === cat.id);
            } else {
              return (wf.category_id === cat.id);
            }
          })
        cat.workflow_specs.sort((x,y) => x.display_order - y.display_order);
      });

      // Set master spec
      wfs.forEach(wf => {
        if (wf.is_master_spec){
          this.masterStatusSpec = wf;
        }
      });

      // Set the selected workflow to something sensible.
      if (!selectedSpecName && this.selectedSpec) {
        selectedSpecName = this.selectedSpec.id;
      }
      if (selectedSpecName) {
        this.workflowSpecs.forEach(ws => {
          if (selectedSpecName && selectedSpecName === ws.id) {
            this.selectedSpec = ws;
            this.selectedCatID = ws.category_id;
            this.setCatByID(ws.category_id);
          }
        });
      }
    });
  }

  private _upsertWorkflowSpecification(isNew: boolean, data: WorkflowSpecDialogData) {
    if (data.id && data.display_name && data.description) {

      const newSpec: WorkflowSpec = {
        id: data.id,
        display_name: data.display_name,
        description: data.description,
        category_id: data.category_id,
        standalone: data.standalone,
        library: data.library,
        libraries: data.libraries ? data.libraries : [],
        is_master_spec: data.is_master_spec ? data.is_master_spec : false,
        primary_file_name: data.primary_file_name ? data.primary_file_name : '',
        primary_process_id: data.primary_process_id ? data.primary_process_id : '',
      };

      if (isNew) {
        this._addWorkflowSpec(newSpec);
      } else {
        this._updateWorkflowSpec(data.id, newSpec);
      }
    }
  }

  private _upsertWorkflowSpecCategory(data: WorkflowSpecCategoryDialogData) {
    if (data.display_name) {
      if (this.categories.find(x => x.id === data.id)) {
        const newCat: WorkflowSpecCategory = {
          id: data.id,
          display_name: data.display_name,
          display_order: data.display_order,
          admin: data.admin,
      };
        this._updateWorkflowSpecCategory(data.id, newCat);
      } else {
        const newCat: WorkflowSpecCategory = {
          id: data.id,
          display_name: data.display_name,
          admin: data.admin,
      };
        this._addWorkflowSpecCategory(newCat);
      }
    }
  }

  gitPush() {
    const dialogRef = this.dialog.open(GitRepoDialogComponent, {
      height: '75vh',
      width: '40vw',
    });

   dialogRef.afterClosed().subscribe((data) => {
     if (data) {
       let comment = data.comment || '';
       this.api.gitRepoPush(comment).subscribe(_ => {
         this._displayMessage(`Successfully pushed the Git state`);
       });
     }
   });
  }

  gitPull() {
    this.api.gitRepoPull().subscribe(_ => {
      this.api.gitRepoPush('').subscribe(_ => {
        this._displayMessage(`Successfully pulled the Git state`);
      })
    });
  }

  gitMerge() {
    // If the merge branch is 'all', open the repo popup.
    if (this.gitRepo.merge_branch == 'all') {
      const dialogRef = this.dialog.open(GitMergeDialogComponent, {
        height: '75vh',
        width: '40vw',
      });

      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.api.gitRepoMerge(data.merge_branch).subscribe(_ => {
            this.gitPull();
          });
        }
      });
    } else {
    this.api.gitRepoMerge(this.gitRepo.merge_branch).subscribe(_ => {
        this.gitPull();
    });}
  };

  private _updateWorkflowSpec(specId: string, newSpec: WorkflowSpec) {
    this.api.updateWorkflowSpecification(specId, newSpec).subscribe(_ => {
      this._loadWorkflowLibraries(newSpec.id);
      this._loadWorkflowSpecs(newSpec.id);
      this._displayMessage('Saved changes to workflow spec.');
    });
  }

  private _addWorkflowSpec(newSpec: WorkflowSpec) {
    this.api.addWorkflowSpecification(newSpec).subscribe(_ => {
      this._loadWorkflowLibraries(newSpec.id);
      this._loadWorkflowSpecs(newSpec.id);
      this._displayMessage('Saved new workflow spec.');
      this.selectSpec(newSpec);
    });
  }

  private _deleteWorkflowSpec(workflowSpec: WorkflowSpec) {
    this.api.deleteWorkflowSpecification(workflowSpec.id).subscribe(() => {
      this._loadWorkflowSpecs();
      this._loadWorkflowLibraries();
      this._displayMessage(`Deleted workflow spec ${workflowSpec.id}.`);
    });
  }

  private _updateWorkflowSpecCategory(catId: string, newCat: WorkflowSpecCategory) {
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
      this._displayMessage(`Deleted workflow spec category ${workflowSpecCategory.display_name}.`);
    });
  }

  private _displayMessage(message: string) {
    this.snackBar.open(message, 'Ok', {duration: 3000});
  }

}
