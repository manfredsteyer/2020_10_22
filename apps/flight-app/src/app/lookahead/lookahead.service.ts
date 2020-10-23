
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Flight } from '@flight-workspace/flight-lib';
import { BehaviorSubject, combineLatest, interval, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class LookaheadService implements OnDestroy {

    private loadingSubject = new BehaviorSubject<boolean>(false);
    private inputSubject = new Subject<string>();

    readonly flights$: Observable<Flight[]>;
    readonly loading$ = this.loadingSubject.asObservable();


    readonly online$: Observable<boolean>;
    
    private close$ = new Subject<void>();

    constructor(private http: HttpClient) { 

        this.online$ 
            = interval(2000).pipe(
                    startWith(0), 
                    map(_ => Math.random() < 0.5), 
                    distinctUntilChanged(), 
                    shareReplay(1),
            );

        this.flights$ = combineLatest([this.inputSubject, this.online$]).pipe(
            filter( ([_, online]) => online),
            map(([input, _]) => input ),
            distinctUntilChanged(), // prev === curr
            tap(v => this.loadingSubject.next(true)),
            switchMap(input => this._load(input)),
            tap(v => this.loadingSubject.next(false)),
            takeUntil(this.close$)
        )
    }
    
    ngOnDestroy(): void {
        this.close$.next();
    }

    // close(): void {
    //     this.close$.next();
    // }

    load(from: string): void {
        this.inputSubject.next(from);
    }

    _load(from: string)  {
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