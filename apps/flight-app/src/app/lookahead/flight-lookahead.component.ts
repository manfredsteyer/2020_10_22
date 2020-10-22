import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, interval, Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { catchError, concatMap, debounceTime, delay, distinctUntilChanged, exhaustMap, filter, map, mergeMap, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Flight } from '@flight-workspace/flight-lib';

@Component({
    selector: 'flight-lookahead',
    templateUrl: './flight-lookahead.component.html'
})

export class FlightLookaheadComponent implements OnInit {

    constructor(private http: HttpClient) {
    }

    control: FormControl;

    flights$: Observable<Flight[]>;
    loading$ = new BehaviorSubject<boolean>(false);
    online$: Observable<boolean>;

    ngOnInit() {
        this.control = new FormControl();


        this.online$ 
                = interval(2000).pipe( // 1, 2, 3, 4, ...
                        startWith(0), // 0, 1, 2, 3, 4, ...
                        // map(_ => Math.random() < 0.5), // t, t, t, f, f, t
                        map(_ => true),
                        distinctUntilChanged(), // t, f, t
                        shareReplay(1),
                );

        const input$ =  this.control.valueChanges.pipe(
            filter(v => v.length >= 3),
            debounceTime(300),
        )

        this.flights$ = combineLatest([input$, this.online$]).pipe(
            // [input, online]
            filter( ([_, online]) => online),
            // [input, online] --> input
            map(([input, _]) => input ),
            tap(v => this.loading$.next(true)),
            switchMap(input => this.load(input)),
            tap(v => this.loading$.next(false))
        )

        //  this
        //                     .control
        //                     .valueChanges
        //                     .pipe(
        //                      
                             
        //                     );
    }

    load(from: string)  {
        const url = "http://www.angular.at/api/flight";

        const params = new HttpParams()
                            .set('from', from);

        const headers = new HttpHeaders()
                            .set('Accept', 'application/json');

        return this.http.get<Flight[]>(url, {params, headers}).pipe(
            catchError(err => {
                console.error('err', err);
                return of([]);
                // return throwError(err);
            }),
        )
    };


}
