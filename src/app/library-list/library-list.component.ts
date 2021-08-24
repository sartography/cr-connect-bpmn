import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {
  ApiService,
  WorkflowSpec
} from 'sartography-workflow-lib';

@Component({
  selector: 'app-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent implements OnInit, OnChanges {
  @Input() workflowSpecId: string;
  @Input() showAll: boolean;
  workflowLibraries: WorkflowSpec[];

  constructor(
    private api: ApiService,
  ) {
    this.showAll = false;
    this.workflowLibraries =[];
  }

  ngOnInit() {
    this._loadWorkflowLibraries();
  }

  ngOnChanges() {
    this._loadWorkflowLibraries();
  }


  isChecked(libraryspec): boolean {
    let checked = false;
    for (const item of libraryspec.parents) {
      checked = checked || (item.id === this.workflowSpecId);
    }
    return checked;
  }

  getCurrentItems(){
    return this.workflowLibraries.filter((item)=> this.isChecked(item) || this.showAll)
  }

  updateItem(library: WorkflowSpec , checked: boolean) {
    if (checked) {
      this.api.deleteWorkflowLibrary(this.workflowSpecId, library.id).subscribe(() => {
        this._loadWorkflowLibraries();
      });
    } else {
      this.api.addWorkflowLibrary(this.workflowSpecId, library.id).subscribe(() => {
        this._loadWorkflowLibraries();
      });
    }
  }

  private _loadWorkflowLibraries() {

    this.api.getWorkflowSpecificationLibraries().subscribe(wfs => {
      this.workflowLibraries = wfs;
    });
  }
}
