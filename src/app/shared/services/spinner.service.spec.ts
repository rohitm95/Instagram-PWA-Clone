import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';
import { take } from 'rxjs';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpinnerService],
    });
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when showSpinner is called with true', (done) => {
    service.showSpinner$.pipe(take(1)).subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });

    service.showSpinner(true);
  });

  it('should emit false when showSpinner is called with false', (done) => {
    service.showSpinner$.pipe(take(1)).subscribe((value) => {
      expect(value).toBeFalse();
      done();
    });

    service.showSpinner(false);
  });

  it('should emit multiple values correctly', (done) => {
    const expectedValues = [true, false, true];
    let emittedValues: boolean[] = [];

    service.showSpinner$.subscribe((value) => {
      emittedValues.push(value);
      if (emittedValues.length === expectedValues.length) {
        expect(emittedValues).toEqual(expectedValues);
        done();
      }
    });

    service.showSpinner(true);
    service.showSpinner(false);
    service.showSpinner(true);
  });
});
