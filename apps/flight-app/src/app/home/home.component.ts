import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, interval, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, scan } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  expertMode = false;
  needsLogin$: Observable<boolean>;
  _userName = '';

  get userName(): string {
    return this._userName;
  }

  constructor(private route: ActivatedRoute) {

    // interval(1000).pipe(  // 1, 2, 3, 4, 5, ...
    //   scan( (acc, value) => {
    //     const v = [...acc, value];
    //     return v;
    //   }, [])
    // )
    // .subscribe(v => console.debug('acc', v));


    const sub = new BehaviorSubject<string>('init');

    sub.next('A');
    sub.next('B');
    sub.next('C');

    sub.subscribe(v => console.debug('subject says', v));

    // share, shareReplay, publish/connect


  }

  changed($event): void {
    console.debug('$event.detail ', $event.target.detail);

    this.expertMode = $event.detail;
  }

  ngOnInit() {
    this.needsLogin$ = this.route.params.pipe(
      map(params => !!params['needsLogin'])
    );
  }

  login(): void {
    this._userName = 'Login will be implemented in another exercise!';
  }

  logout(): void {
    this._userName = '';
  }
}
