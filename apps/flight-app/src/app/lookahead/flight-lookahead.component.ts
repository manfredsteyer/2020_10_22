import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, interval, Observable, of, Subject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { catchError, concatMap, debounceTime, delay, distinctUntilChanged, exhaustMap, filter, first, map, mergeMap, shareReplay, startWith, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { Flight } from '@flight-workspace/flight-lib';
import { LookaheadService } from './lookahead.service';


function trace(label: string) {
    return <T>(source: Observable<T>): Observable<T> => {
        return source.pipe(tap(data => console.debug('trace', label, data)));
    }
}

@Component({
    selector: 'flight-lookahead',
    templateUrl: './flight-lookahead.component.html'
})
export class FlightLookaheadComponent implements OnInit, OnDestroy {

    control: FormControl;

    readonly flights$ = this.lookaheadService.flights$;
    readonly loading$ = this.lookaheadService.loading$;
    readonly online$ = this.lookaheadService.online$;

    private close$ = new Subject<void>();

    constructor(private lookaheadService: LookaheadService) {
    }

    ngOnInit() {
        this.control = new FormControl();

        this.control.valueChanges.pipe(
            filter(v => v.length >= 3),
            debounceTime(300),
            takeUntil(this.close$)
        ).subscribe( v => {
            this.lookaheadService.load(v);
        });
    }

    ngOnDestroy(): void {
        this.close$.next();
    }

   


}
