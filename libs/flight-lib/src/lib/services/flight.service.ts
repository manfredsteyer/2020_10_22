import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of, ConnectableObservable, BehaviorSubject } from 'rxjs';
import { Flight } from '../models/flight';
import { shareReplay, publish } from 'rxjs/operators';
import { produce } from 'immer';

@Injectable()
export class FlightService {

  flights: Flight[] = [];
  baseUrl = `http://www.angular.at/api`;
  reqDelay = 1000;

  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  readonly flights$: Observable<Flight[]> = this.flightsSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  load(from: string, to: string, urgent: boolean): void {

    // Cold == Default, 1:N, Lazy
    // Hot == Multicasting, 1:N, Eager

    this.find(from, to, urgent)
      .subscribe(
        flights => {
          this.flights = flights;
          this.flightsSubject.next(flights);
        },
        err => console.error('Error loading flights', err)
      );
  }

  find(from: string, to: string, urgent: boolean = false): Observable<Flight[]> {

    // For offline access
    // let url = '/assets/data/data.json';

    // For online access
    let url = [this.baseUrl, 'flight'].join('/');

    if (urgent) {
      url = [this.baseUrl, 'error?code=403'].join('/');
    }

    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    const headers = new HttpHeaders()
      .set('Accept', 'application/json');

    const reqObj = { params, headers };
    return this.http.get<Flight[]>(url, reqObj);
    // return of(flights).pipe(delay(this.reqDelay))

  }

  findById(id: string): Observable<Flight> {
    const reqObj = { params: null };
    reqObj.params = new HttpParams().set('id', id);
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.get<Flight>(url, reqObj);
    // return of(flights[0]).pipe(delay(this.reqDelay))
  }

  save(flight: Flight): Observable<Flight> {
    const url = [this.baseUrl, 'flight'].join('/');
    return this.http.post<Flight>(url, flight);
  }

  delay() {
    const ONE_MINUTE = 1000 * 60;

    const oldDate = new Date(this.flights[0].date);

    this.flights = produce(this.flights, oldFlightsDraft => {
      const date = new Date(oldDate.getTime() + 15 * ONE_MINUTE);
      oldFlightsDraft[0].date = date.toISOString();
    });

    this.flightsSubject.next(this.flights);

  }

}
