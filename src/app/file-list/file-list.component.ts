import {Component, Input, OnInit} from '@angular/core';
import {ApiService, FileMeta, FileType, WorkflowSpec} from 'sartography-workflow-lib';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  @Input() workflowSpec: WorkflowSpec;
  fileMetas: FileMeta[];

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.loadFileMetas();
  }

  getIconCode(file_type: string) {
    console.log('content_type', file_type);
    switch (file_type) {
      case FileType.BPMN:
        return 'account_tree';
      case FileType.SVG:
        return 'image';
      case FileType.DMN:
        return 'view_list';
    }
  }

  deleteFile(fileMetaId: number) {
    this.api.deleteFileMeta(fileMetaId).subscribe(() => this.loadFileMetas());
  }

  private loadFileMetas() {
    this.api.listBpmnFiles(this.workflowSpec.id).subscribe(fms => this.fileMetas = fms);
  }
}
