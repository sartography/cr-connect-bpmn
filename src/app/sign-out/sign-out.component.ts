import {Component, OnInit} from '@angular/core';
import {ApiService} from 'sartography-workflow-lib';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss']
})
export class SignOutComponent implements OnInit {

  constructor(private api: ApiService) {
    localStorage.removeItem('token');
  }

  ngOnInit() {
  }

  goHome() {
    this.api.openUrl('/');
  }
}
