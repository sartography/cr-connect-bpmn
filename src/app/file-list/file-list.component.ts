import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @Input() workflowSpec: WorkflowSpec;
  fileMetas: FileMeta[];

  constructor(
    private api: ApiService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadFileMetas();
  }

  deleteFile(fileMetaId: number) {
    this.api.deleteFileMeta(fileMetaId).subscribe(() => this.loadFileMetas());
  }

  private loadFileMetas() {
    this.api.listBpmnFiles(this.workflowSpec.id).subscribe(fms => this.fileMetas = fms);
  }

  editFile(fileMetaId: number) {
    this.router.navigate([`/modeler/${this.workflowSpec.id}/${fileMetaId}`]);
  }
}
