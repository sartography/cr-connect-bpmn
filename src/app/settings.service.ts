import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private studyIdKey = 'study_id';

  constructor() { }

  setStudyIdForValidation(id: number) {
    if (id != null) {
      localStorage.setItem(this.studyIdKey, id.toString());
    } else {
      localStorage.removeItem(this.studyIdKey)
    }
  }

  getStudyIdForValidation() {
    const value = localStorage.getItem(this.studyIdKey);
    if (value) {
      return parseInt(value, 10);
    } else {
      return null;
    }
  }
}
