import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ApiResponse } from '../model/api.response';

import { throwError, Observable } from 'rxjs';
import {
  catchError,
  map,
  // tap,
} from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Leave } from '../model/leave';

@Injectable({ providedIn: 'root' })
export class LeaveService {
  /**
   * Creates a new NameListService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl + '/api/leave/';

  getLeaves(): Observable<Leave[]> {
    return this.http.get<Leave[]>(this.baseUrl);
  }

  // getLeaveById(id: number): Observable<any> {
  //   return this.http.get(this.baseUrl + id);
  // }

  createLeave(leave: Leave): Observable<Leave> {
    return this.http.post<Leave>(this.baseUrl, leave);
  }

  // updateLeave(id: number, leave: Leave): Observable<Leave> {
  //   return this.http.put<Leave>(this.baseUrl + leave.leaveId, leave);
  // }

  // deleteLeave(id: number): Observable<Leave> {
  //   return this.http.delete<Leave>(this.baseUrl + id);
  // }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : 'Server error';
    console.error(errMsg); // log to console instead
    // return of(errMsg);
    return throwError(errMsg);
  }
}
