import {Component} from '@angular/core';
import {ApiService, isSignedIn} from 'sartography-workflow-lib';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private apiService: ApiService) {
  }

  get isSignedIn(): boolean {
    return this.apiService.isSignedIn();
  }
}
