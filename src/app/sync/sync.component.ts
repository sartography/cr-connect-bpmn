import { Component, OnInit } from '@angular/core';
import {ApiService, SyncCategoryItem, SyncSource, WorkflowSpecSync} from '../../../../sartography-libraries/dist/sartography-workflow-lib';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})
export class SyncComponent implements OnInit {
  private sources = new BehaviorSubject<SyncSource[]>([]);
  public sources$ = this.sources.asObservable();
  private changes = new BehaviorSubject<SyncCategoryItem[]>([]);
  public changes$ = this.changes.asObservable();
  public currentSource = 0;
  public uploading = true;
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.uploading=true;
    this.api.syncSources().subscribe(results => this.loadSyncSources(results))
  }

  loadSyncSources(sources: SyncSource[]): void {
    this.sources.next(sources);
    if (this.currentSource > this.sources.value.length) {
      this.currentSource = this.sources.value.length -1;
    }
    this.api.getSyncList(this.sources.value[this.currentSource].url, false).subscribe(results => {this.changes.next(results);
      this.uploading = false;})
  }

  currentSourceClass(currentitem: SyncSource): string {
    if (this.sources.value[this.currentSource] === currentitem) {
      return 'currentsource'
    }
    return 'notcurrentsource'
  }

  setSource(currentitem: SyncSource): void {
    this.uploading=true;
    for (let i = 0; i < this.sources.value.length; i++){
      if (currentitem === this.sources.value[i])
        this.currentSource = i;
    }
    this.api.getSyncList(this.sources.value[this.currentSource].url, false).subscribe(results => {this.changes.next(results);
      this.uploading = false;})
  }

  statusColor(status : string): string {
    if (status === 'update')
      return  'will be Updated to Remote'
    if (status === 'revert')
      return  'will be Reverted to Remote'
    if (status === 'delete')
      return  'will be DELETED!'
    if (status === 'keep')
      return  'will be Kept'
    if (status === 'copy')
      return  'will be Copied from Remote'
    return ''


  }
}
