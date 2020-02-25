import {PlatformLocation} from '@angular/common';
import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {ApiService, AppEnvironment, User} from 'sartography-workflow-lib';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'uid',
      type: 'input',
      defaultValue: 'czn1z',
      templateOptions: {
        required: true,
        label: 'UVA Computing ID',
      },
    },
    {
      key: 'email_address',
      type: 'input',
      defaultValue: 'czn1z@virginia.edu',
      templateOptions: {
        required: true,
        type: 'email',
        label: 'UVA Email Address',
      },
      validators: {validation: ['email']},
    },
    {
      key: 'first_name',
      type: 'input',
      defaultValue: 'Cordi',
      templateOptions: {
        label: 'First Name',
      },
    },
    {
      key: 'last_name',
      type: 'input',
      defaultValue: 'Nator',
      templateOptions: {
        label: 'First Name',
      },
    },
  ];
  error: Error;


  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private router: Router,
    private api: ApiService,
    private platformLocation: PlatformLocation
  ) {
  }

  ngOnInit() {
    this._redirectOnProduction();
  }

  signIn() {
    this.error = undefined;
    localStorage.removeItem('token');

    // For testing purposes, create a user to simulate login.
    if (!this.environment.production) {
      this.model.redirect_url = this.platformLocation.href + 'session';
      this.api.openSession(this.model);
    } else {
      this.error = new Error('This feature does not work in production.');
    }
  }

  // If this is production, verify the user and redirect to home page.
  private _redirectOnProduction() {
    if (this.environment.production) {
      this.api.getUser().subscribe((user: User) => {
        this.router.navigate(['/']);
      }, e => {
        this.error = e;
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      });
    } else {
      localStorage.removeItem('token');
    }
  }
}
