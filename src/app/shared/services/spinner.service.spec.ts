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
    service.showSpinner$.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
    service.showSpinner(true);
  });

  it('should hide the spinner when showSpinner(false) is called', (done) => {
    service.showSpinner$.subscribe((isVisible) => {
      expect(isVisible).toBeFalse();
      done();
    });
    service.showSpinner(false);
  });

  it('should emit true when showSpinner is called with true', (done) => {
    service.showSpinner$.pipe(take(1)).subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
    service.showSpinner(true);
  });

  it('should emit false when showSpinner(false) is called', (done) => {
    service.showSpinner$.pipe(take(1)).subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
    service.showSpinner(false);
  });

  it('should handle multiple calls to showSpinner(true)', (done) => {
    service.showSpinner$.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
    service.showSpinner(true);
    service.showSpinner(true);
  });

  it('should hide the spinner on multiple calls to showSpinner(false)', () => {
    let spinnerVisible: boolean;
    service.showSpinner$.subscribe((show) => {
      spinnerVisible = show;
    });
    service.showSpinner(false);
    service.showSpinner(false);
    expect(spinnerVisible).toBeFalse();
  });
});
