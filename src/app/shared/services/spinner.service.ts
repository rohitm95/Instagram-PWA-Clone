import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new Subject<boolean>();
  showSpinner$ = this.spinnerSubject.asObservable();
  showSpinner(show: boolean) {
    this.spinnerSubject.next(show);
  }
}
