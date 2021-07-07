import {Component, Input, OnInit, Output} from '@angular/core';
import {Study} from 'sartography-workflow-lib/lib/types/study';
import {ApiService} from 'sartography-workflow-lib';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  studies: Study[] = [];
  selectedStudyId: number;

  constructor(private apiService: ApiService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.selectedStudyId = this.settingsService.getStudyIdForValidation();

    this.apiService.getStudies().subscribe(s => {
      this.studies = s;
    });
  }

  selectStudy(studyId: number) {
    console.log('The study is ', studyId);
    this.settingsService.setStudyIdForValidation(studyId);
  }

}
