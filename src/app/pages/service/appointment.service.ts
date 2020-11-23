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
import { Appointment, RegisterAppt } from '../model/appointment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  /**
   * Creates a new NameListService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl + '/api/appointments/';

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl);
  }

  createAppointment(appointment: RegisterAppt): Observable<RegisterAppt> {
    return this.http.post<RegisterAppt>(this.baseUrl, appointment);
  }

  deleteAppointment(id: number): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        appointmentId: id,
      },
    };
    return this.http.delete<any>(this.baseUrl, options);
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
