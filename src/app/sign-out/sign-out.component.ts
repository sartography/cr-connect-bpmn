import {Component, OnInit} from '@angular/core';
import {ApiService} from 'sartography-workflow-lib';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss']
})
export class SignOutComponent implements OnInit {

  constructor(private api: ApiService, private router: Router) {
    localStorage.removeItem('token');
  }

  ngOnInit() {
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
