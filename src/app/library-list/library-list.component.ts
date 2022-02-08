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
  @Input() workflowSpec: WorkflowSpec;
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
    checked = checked || this.workflowSpec.libraries.indexOf(libraryspec.id) >= 0 ;
    return checked;
  }

  getCurrentItems(){
    return this.workflowLibraries.filter((item)=> this.isChecked(item) || this.showAll)
  }

  updateItem(library: WorkflowSpec , checked: boolean) {
    if (checked) {
      this.api.deleteWorkflowLibrary(this.workflowSpec.id, library.id).subscribe(() => {
        this._loadWorkflowLibraries();
      });
    } else {
      this.api.addWorkflowLibrary(this.workflowSpec.id, library.id).subscribe(() => {
        this._loadWorkflowLibraries();
      });
    }
  }

  private _loadWorkflowLibraries() {

    this.api.getWorkflowSpecificationLibraries().subscribe(wfs => {
      this.workflowLibraries = wfs;
    });
    this.api.getWorkflowSpecification(this.workflowSpec.id).subscribe(spec => {
      this.workflowSpec = spec;
    });
  }
}
