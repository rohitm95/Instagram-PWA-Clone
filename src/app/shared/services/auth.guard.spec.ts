import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let routerMock: any;

  beforeEach(() => {
    routerMock = {
      navigate: jasmine.createSpy(),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
      ]
    });
    // Mocking the Router injection
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should allow access if token exists', () => {
    // Simulate a token being present in localStorage
    spyOn(window.localStorage, 'getItem').and.returnValue('mockToken');

    const result = TestBed.runInInjectionContext(() => {
      return authGuard(null, null);
    });

    expect(result).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if token does not exist', () => {
    const result = TestBed.runInInjectionContext(() => {
      return authGuard(null, null);
    });

    expect(result).toBeUndefined(); // Since navigate returns a Promise
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
