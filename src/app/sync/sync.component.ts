import { Component, OnInit } from '@angular/core';
import {ApiService, SyncCategoryItem, SyncSource} from '../../../../sartography-libraries/dist/sartography-workflow-lib';
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
  public keepLocal = false;
  public syncAvailable = new BehaviorSubject<boolean>(false);
  public syncAvailable$ = this.syncAvailable.asObservable();
  public githubComment = new BehaviorSubject<string>("");
  public githubComment$ = this.githubComment.asObservable();

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.uploading=true;
    this.api.syncSources().subscribe(results => this.loadSyncSources(results))
  }

  reloadSyncList(): void {
    this.uploading=true;
    this.api.getSyncList(this.sources.value[this.currentSource].url, this.keepLocal).subscribe(results => {this.changes.next(results);
      this.syncAvailable.next(this.changes.value.length!==0);
      console.log(this.syncAvailable.value);
      this.uploading = false;})
  }

  loadSyncSources(sources: SyncSource[]): void {
    this.sources.next(sources);
    if (this.currentSource > this.sources.value.length) {
      this.currentSource = this.sources.value.length -1;
    }
    this.githubComment.next( 'Sync from ' + this.sources.value[this.currentSource].name)
    this.reloadSyncList();
  }

  currentSourceClass(currentitem: SyncSource): string {
    if (this.sources.value[this.currentSource] === currentitem) {
      return 'currentsource'
    }
    return 'notcurrentsource'
  }

  setSource(currentitem: SyncSource): void {
    for (let i = 0; i < this.sources.value.length; i++){
      if (currentitem === this.sources.value[i])
        this.currentSource = i;
    }
    this.githubComment.next( 'Sync from ' + this.sources.value[this.currentSource].name)
    this.reloadSyncList();
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

  changeGithubComment(event: any): void{
    this.githubComment.next(event.target.value)
  }

  toggleKeepLocal(event: any): void {
    console.log(event.checked);
    this.keepLocal = event.checked;
    this.reloadSyncList();
  }

  gitSync(): void{
    this.api.publishToGithub(this.githubComment.value).subscribe(()=>this.reloadSyncList())
  }

  doSync(): void{
    this.uploading = true;
    this.api.syncPullAll(this.sources.value[this.currentSource].url, this.keepLocal).subscribe(() => this.gitSync())
  }

}
