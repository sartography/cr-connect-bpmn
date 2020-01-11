import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {WorkflowSpec} from 'sartography-workflow-lib';
import {FileMeta} from 'sartography-workflow-lib';

export interface ApiError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiUrl: string = environment.api;

  constructor(private httpClient: HttpClient) {
  }

  listWorkflowSpecifications(): Observable<WorkflowSpec[]> {
    const url = this.apiUrl + '/workflow-specification';

    return this.httpClient
      .get<WorkflowSpec[]>(url)
      .pipe(catchError(this._handleError));
  }

  listBpmnFiles(specId: string): Observable<FileMeta[]> {
    const url = this.apiUrl + '/file';
    const params = new HttpParams().set('spec_id', specId);

    return this.httpClient
      .get<FileMeta[]>(url, {params: params})
      .pipe(catchError(this._handleError));
  }

  getFileData(fileId: number): Observable<Blob> {
    const url = this.apiUrl + '/file/' + fileId + '/data';

    return this.httpClient
      .get(url, {responseType: 'blob'})
      .pipe(catchError(this._handleError));
  }

  getBpmnXml(url: string): Observable<string> {
    return this.httpClient
      .get(url, {responseType: 'text'})
      .pipe(catchError(this._handleError));
  }

  private _handleError(error: ApiError) {
    return throwError(error.message || 'Could not complete your request; please try again later.');
  }

}
