import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { ApiResponse } from '../model/api.response';

import { throwError, Observable } from 'rxjs';
import {
  catchError,
  map,
  // tap,
} from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * Creates a new NameListService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl + '/api/users/';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  // getUserById(id: number): Observable<any> {
  //   return this.http.get(this.baseUrl + id);
  // }

  // getUserByHairStylistId(hairstylistId: number): Observable<any> {
  //   return this.http.get(this.baseUrl + hairstylistId);
  // }

  // createUser(user: User): Observable<User> {
  //   return this.http.post<User>(this.baseUrl, user);
  // }

  // updateUser(id: number, user: User): Observable<User> {
  //   return this.http.put<User>(this.baseUrl + user.username, user);
  // }

  // deleteUser(id: number): Observable<User> {
  //   return this.http.delete<User>(this.baseUrl + id);
  // }

  //   get(): Observable<{ timeslots: User[] }> {
  //     return this.http
  //       .get<{ timeslots: User[] }>(environment.apiUrl + '/appts')
  //       .pipe(
  //         map((data) => {
  //           data.timeslots = data.timeslots.map((x) => new User());
  //           return data;
  //         }),
  //         catchError(this.handleError)
  //       );
  //   }

  //   put(requestId: string, userdate: string, usertimeslot: string) {
  //     const req = {
  //       userdate: userdate,
  //       usertimeslot: usertimeslot,
  //     };
  //     return this.http
  //       .put(environment.apiUrl + 'requests/' + requestId + '/appt', req)
  //       .pipe(catchError(this.handleError));
  //   }

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
