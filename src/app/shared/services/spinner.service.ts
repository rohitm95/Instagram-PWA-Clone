import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  showSpinner = new Subject<boolean>();
  constructor() { }
}
