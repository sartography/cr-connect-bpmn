import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment, isSignedIn, User, UserParams} from 'sartography-workflow-lib';

interface NavItem {
  path?: string;
  id: string;
  label: string;
  icon?: string;
  links?: NavItem[];
  action?: () => void;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  navLinks: NavItem[];
  user: User;

  constructor(
    private router: Router,
    private api: ApiService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
  ) {
    this._loadUser();
  }

  isLinkActive(path: string) {
    return path === this.router.url;
  }

  private _loadUser() {
    if (isSignedIn()) {
      this.api.getUser().subscribe(u => {
        this.user = u;
        this._loadNavLinks();
      }, error => {
        localStorage.removeItem('token');
      });
    }
  }

  private _loadNavLinks() {
    const displayName = this.user.display_name || this.user.first_name || this.user.last_name;
    this.navLinks = [
      {path: '/home', id: 'nav_home', label: 'Configurator'},
      {path: '/pb', id: 'nav_pb', label: 'Protocol Builder Tester'},
      {path: '/reffiles', id: 'nav_reffiles', label: 'Reference Files'},
      {path: '/help', id: 'nav_help', label: 'Help'},
      {
        id: 'nav_account', label: `${displayName} (${this.user.email_address})`,
        icon: 'account_circle',
        links: [
          {path: '/profile', id: 'nav_profile', label: 'Profile', icon: 'person'},
          {path: '/notifications', id: 'nav_notifications', label: 'Notifications', icon: 'notifications'},
          {path: '/sign-out', id: 'nav_sign_out', label: 'Sign out', icon: 'exit_to_app'},
        ]
      }
    ];
  }
}
