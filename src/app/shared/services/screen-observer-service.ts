import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScreenObserverService {
    private screenSizeSubject = new BehaviorSubject<BreakpointState>(this.getCurrentScreenSize());
    updateScreenSize$ = this.screenSizeSubject.asObservable();
    constructor() {
        window.addEventListener('resize', () => {
          this.screenSizeSubject.next(this.getCurrentScreenSize());
        });
      }

      observe(): Observable<BreakpointState> {
        return this.screenSizeSubject.asObservable();
      }
    
      private getCurrentScreenSize(): BreakpointState {
        return {
          matches: window.innerWidth < 768, // Example condition
          breakpoints: {
            xs: window.innerWidth < 576,
            sm: window.innerWidth >= 576 && window.innerWidth < 768,
            md: window.innerWidth >= 768 && window.innerWidth < 992,
            lg: window.innerWidth >= 992 && window.innerWidth < 1200,
            xl: window.innerWidth >= 1200,
          },
        };
      }
}
