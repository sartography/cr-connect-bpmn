import {Component, Inject, OnInit} from '@angular/core';
import {AppEnvironment} from 'sartography-workflow-lib';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  title: string;

  constructor(@Inject('APP_ENVIRONMENT') private environment: AppEnvironment) {
    this.title = environment.title;
  }

  ngOnInit() {
  }

}
