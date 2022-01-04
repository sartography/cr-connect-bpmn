import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService, AppEnvironment, GoogleAnalyticsService, isSignedIn, User} from 'sartography-workflow-lib';

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
  title: string;

  constructor(
    private router: Router,
    private api: ApiService,
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this._loadUser();
    this.title = environment.title;
  }

  isLinkActive(path: string) {
    return path === this.router.url;
  }

  private _loadUser() {
    if (isSignedIn()) {
      this.api.getUser().subscribe(u => {
        this.user = u;

        if (this.user && this.user.uid) {
          this.googleAnalyticsService.setUser(this.user.uid);
        }

        this._loadNavLinks();
      }, error => {
        localStorage.removeItem('token');
      });
    }
  }

  private _loadNavLinks() {
    const displayName = this.user.ldap_info.display_name;
    this.navLinks = [
      {path: '/home', id: 'nav_home', label: 'Configurator'},
      {path: '/reffiles', id: 'nav_reffiles', label: 'Reference Files'},
      {path: '/settings', id: 'settings', label: 'Settings'},
      {
        id: 'nav_account', label: `${displayName} (${this.user.ldap_info.email_address})`,
        icon: 'account_circle'
      }
    ];
  }
}
