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
import { Customer, RegisterCustomer } from '../model/customer';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  /**
   * Creates a new NameListService with the injected HttpClient.
   * @param {HttpClient} http - The injected HttpClient.
   * @constructor
   */
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiUrl + '/api/customers/';

  createCustomer(customer: RegisterCustomer): Observable<RegisterCustomer> {
    return this.http.post<RegisterCustomer>(this.baseUrl, customer);
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
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
