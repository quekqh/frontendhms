import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  /**
   * Creates a new NameListService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl + '/api/login/';

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {{}} The Observable for the HTTP request.
   */

  userLogin(username: string, password: string): Observable<{}> {
    return this.http
      .post<any>(this.baseUrl + 'user/', {
        username: username,
        password: password,
      })
      .pipe(catchError(this.handleError));
  }

  adminLogin(username: string, password: string): Observable<{}> {
    return this.http
      .post<any>(this.baseUrl + 'admin/', {
        username: username,
        password: password,
      })
      .pipe(catchError(this.handleError));
  }

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
