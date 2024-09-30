import { BreakpointObserver } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScreenObserverService {
    observer = inject(BreakpointObserver);

    observe() {
        return this.observer.observe(['(max-width: 800px)'])
    }
}